import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Hospital } from 'lucide-react';
import { seedFirestore } from '../firebase/seedData';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login, register, loading, user } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  // Seed initial data to Firebase (doctors and rooms)
  useEffect(() => {
    const initializeData = async () => {
      try {
        await seedFirestore();
      } catch (error) {
        console.error('Failed to seed data:', error);
      }
    };

    initializeData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      // Error toast allaqachon AuthContext da ko'rsatiladi
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name, phone);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      // Error toast allaqachon AuthContext da ko'rsatiladi
    }
  };

  // Demo accounts info
  const demoAccounts = [
    { role: 'Admin', email: 'admin@shifoxona.uz', password: 'admin123' },
    { role: 'Doktor', email: 'doctor@shifoxona.uz', password: 'doctor123' },
    { role: 'Bemor', email: 'patient@shifoxona.uz', password: 'patient123' }
  ];

  // If already logged in, show loading
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yo'naltirilmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hospital className="w-12 h-12 text-blue-600" />
            <h1 className="font-bold text-4xl text-blue-600">Sog'lom Hayot</h1>
          </div>
          <p className="text-gray-600">Shifoxona boshqaruv tizimi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tizimga kirish</CardTitle>
            <CardDescription>
              Mavjud akkauntingiz bilan kiring yoki yangi akkaunt yarating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Kirish</TabsTrigger>
                <TabsTrigger value="register">Ro'yxatdan o'tish</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@misol.uz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Parol</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Yuklanmoqda...' : 'Kirish'}
                  </Button>
                </form>

                {/* Demo accounts info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Demo akkauntlar:</p>
                  <div className="space-y-2 text-xs text-gray-600">
                    {demoAccounts.map((account) => (
                      <div key={account.role}>
                        <span className="font-medium">{account.role}:</span> {account.email} / {account.password}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-blue-600">
                      💡 Agar doctor yoki patient akkauntlari ishlamasa, DEMO_USERS_SETUP.md fayliga qarang
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name">Ism-familiya</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Ism Familiya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-phone">Telefon</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="email@misol.uz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Parol</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Kamida 6 ta belgi</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
                  </Button>
                </form>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Ro'yxatdan o'tish orqali siz Bemor sifatida tizimga kirasiz
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}