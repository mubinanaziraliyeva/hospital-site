import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, User, Home, Calendar, Users, Building2, Hospital, Phone, Mail, Settings } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'patient':
        return [
          { to: '/patient', icon: Home, label: 'Bosh sahifa' },
          { to: '/patient/doctors', icon: Users, label: 'Doktorlar' },
          { to: '/patient/appointments', icon: Calendar, label: 'Navbatlarim' },
          { to: '/patient/hospital', icon: Hospital, label: 'Shifoxona' }
        ];
      case 'doctor':
        return [
          { to: '/doctor', icon: Home, label: 'Bosh sahifa' },
          { to: '/doctor/schedule', icon: Calendar, label: 'Grafik' }
        ];
      case 'admin':
        return [
          { to: '/admin', icon: Home, label: 'Bosh sahifa' },
          { to: '/admin/doctors', icon: Users, label: 'Doktorlar' },
          { to: '/admin/rooms', icon: Building2, label: 'Xonalar' },
          { to: '/setup', icon: Settings, label: 'Sozlamalar' }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={`/${user.role}`} className="font-bold text-xl text-blue-600">
              Sog'lom Hayot
            </Link>
            <div className="hidden md:flex gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-left hidden md:block">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500 capitalize text-xs">{user.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Profil ma'lumotlari</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Ism</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Telefon</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.specialization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Hospital className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Mutaxassislik</p>
                        <p className="font-medium">{user.specialization}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Rol</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}