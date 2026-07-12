import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'wallet-store.json');

// Interface definition for Wallet Store
interface Subscriber {
  email: string;
  username: string;
  plan: 'monthly' | 'yearly';
  paymentMethod: string;
  paymentDetails: string;
  subscribedAt: string;
}

interface WalletStore {
  walletType: 'paypal' | 'multicaixa_express' | 'bank_iban' | 'crypto' | 'none';
  walletAddress: string;
  ownerName: string;
  balanceKz: number;
  balanceUsd: number;
  subscriptionEarningsKz: number;
  adEarningsUsd: number;
  adClicks: number;
  adImpressions: number;
  subscribers: Subscriber[];
}

// Default state if store doesn't exist
const defaultStore: WalletStore = {
  walletType: 'multicaixa_express',
  walletAddress: '+244 923 456 789',
  ownerName: 'Agnelo Maiato',
  balanceKz: 250000,
  balanceUsd: 150,
  subscriptionEarningsKz: 180000,
  adEarningsUsd: 45.75,
  adClicks: 305,
  adImpressions: 4575,
  subscribers: [
    {
      email: 'mario.silva@netangola.ao',
      username: 'Mário Silva',
      plan: 'monthly',
      paymentMethod: 'multicaixa_express',
      paymentDetails: '+244 912 345 678',
      subscribedAt: '2026-06-15T10:30:00Z'
    },
    {
      email: 'helena.vaz@gamil.com',
      username: 'Helena Vaz',
      plan: 'yearly',
      paymentMethod: 'bank_iban',
      paymentDetails: 'AO06 0040 0000 1234 5678 9012 3',
      subscribedAt: '2026-05-20T14:45:00Z'
    }
  ]
};

// Helper to read store
function readStore(): WalletStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore, null, 2), 'utf8');
      return defaultStore;
    }
  } catch (err) {
    console.error('Error reading wallet-store.json, using default state:', err);
    return defaultStore;
  }
}

// Helper to write store
function writeStore(store: WalletStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to wallet-store.json:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize store on startup
  readStore();

  // --- API ROUTES ---

  // 1. Get Wallet Balance and Configurations
  app.get('/api/wallet', (req, res) => {
    const store = readStore();
    res.json({
      walletType: store.walletType,
      walletAddress: store.walletAddress,
      ownerName: store.ownerName,
      balanceKz: store.balanceKz,
      balanceUsd: store.balanceUsd,
      subscriptionEarningsKz: store.subscriptionEarningsKz,
      adEarningsUsd: store.adEarningsUsd,
      adClicks: store.adClicks,
      adImpressions: store.adImpressions,
      subscribersCount: store.subscribers.length
    });
  });

  // 2. Configure Artist Digital Wallet Connection
  app.post('/api/wallet/config', (req, res) => {
    const { walletType, walletAddress, ownerName } = req.body;
    
    if (!walletType || !walletAddress || !ownerName) {
      return res.status(400).json({ error: 'Faltam dados para configurar a carteira.' });
    }

    const store = readStore();
    store.walletType = walletType;
    store.walletAddress = walletAddress;
    store.ownerName = ownerName;

    writeStore(store);
    res.json({ success: true, message: 'Carteira digital vinculada com sucesso.', wallet: store });
  });

  // 3. Process VIP Fan Subscription (Monthly or Annual)
  app.post('/api/subscribe', (req, res) => {
    const { email, username, plan, paymentMethod, paymentDetails } = req.body;

    if (!email || !username || !plan || !paymentMethod) {
      return res.status(400).json({ error: 'Dados de assinatura incompletos.' });
    }

    const store = readStore();

    // Check if already subscribed to avoid duplicate charges
    const alreadySubscribed = store.subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (alreadySubscribed) {
      return res.json({ success: true, isAlreadyActive: true, message: 'Subscrição VIP já está activa para este e-mail!' });
    }

    // Determine values
    // Plano Mensal: 2500 Kz ($3.00 USD) | Plano Anual: 24000 Kz ($28.00 USD)
    const priceKz = plan === 'yearly' ? 24000 : 2500;
    const priceUsd = plan === 'yearly' ? 28 : 3;

    // Simulate transfer to digital wallet
    store.balanceKz += priceKz;
    store.balanceUsd += priceUsd;
    store.subscriptionEarningsKz += priceKz;

    // Save subscriber
    const newSub: Subscriber = {
      email,
      username,
      plan,
      paymentMethod,
      paymentDetails: paymentDetails || 'Carteira Padrão',
      subscribedAt: new Date().toISOString()
    };

    store.subscribers.push(newSub);
    writeStore(store);

    res.json({
      success: true,
      message: `Assinatura VIP (${plan === 'yearly' ? 'Anual' : 'Mensal'}) processada com sucesso!`,
      subscriber: newSub,
      priceKz,
      priceUsd
    });
  });

  // 4. Record Ad Views and Clicks to increase revenue
  app.post('/api/ads/click', (req, res) => {
    const { isClick } = req.body;
    const store = readStore();

    // Each impression earns $0.005, each click earns $0.15 directly into the wallet
    if (isClick) {
      store.adClicks += 1;
      store.adEarningsUsd += 0.15;
      store.balanceUsd += 0.15;
      // Also add equivalent in local currency (1 USD ≈ 850 Kz in mock)
      store.balanceKz += Math.round(0.15 * 850);
    } else {
      store.adImpressions += 1;
      store.adEarningsUsd += 0.005;
      store.balanceUsd += 0.005;
      store.balanceKz += Math.round(0.005 * 850);
    }

    writeStore(store);
    res.json({
      success: true,
      adEarningsUsd: store.adEarningsUsd,
      balanceUsd: store.balanceUsd,
      balanceKz: store.balanceKz,
      adClicks: store.adClicks,
      adImpressions: store.adImpressions
    });
  });

  // 5. Query VIP Status
  app.get('/api/vip-status', (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.json({ isSubscribed: false });
    }

    // Artist gets auto-subscribed status
    if (email.toLowerCase() === 'agneloheart@gmail.com') {
      return res.json({ isSubscribed: true, plan: 'yearly', type: 'artist' });
    }

    const store = readStore();
    const sub = store.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (sub) {
      res.json({ isSubscribed: true, plan: sub.plan, type: 'fan' });
    } else {
      res.json({ isSubscribed: false });
    }
  });

  // 6. Reset or cash out wallet simulation (for artist convenience)
  app.post('/api/wallet/cashout', (req, res) => {
    const store = readStore();
    
    // Simulate cashout transfer to actual physical bank account
    const transferredKz = store.balanceKz;
    const transferredUsd = store.balanceUsd;
    
    store.balanceKz = 0;
    store.balanceUsd = 0;

    writeStore(store);
    res.json({
      success: true,
      message: `Dinheiro enviado com sucesso para o teu Express/Banco associado!`,
      transferredKz,
      transferredUsd,
      wallet: store
    });
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
