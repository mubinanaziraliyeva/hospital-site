import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Calendar, Clock, User, X, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { db } from "../../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Appointment {
  id: string;
  doctorName: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  queueNumber: number;
  symptoms?: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Firebase dan real-time o'qish
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Appointment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];

        // Sanasi bo'yicha tartibla
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Navbatlarni yuklashda xatolik:", error);
        toast.error("Navbatlarni yuklashda xatolik yuz berdi");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Tasdiqlangan";
      case "pending":
        return "Kutilmoqda";
      case "completed":
        return "Yakunlangan";
      case "cancelled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status: "cancelled",
      });
      toast.success("Navbat bekor qilindi");
    } catch (error) {
      console.error("Bekor qilishda xatolik:", error);
      toast.error("Bekor qilishda xatolik yuz berdi");
    }
  };

  const activeAppointments = appointments.filter(
    (apt) => apt.status !== "completed" && apt.status !== "cancelled",
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled",
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl mb-2">Mening navbatlarim</h1>
        <p className="text-gray-600">
          Barcha navbatlaringizni ko'ring va boshqaring
        </p>
      </div>

      {/* Faol navbatlar */}
      <div className="mb-8">
        <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Faol navbatlar
        </h2>
        {activeAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Faol navbatlar yo'q
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.doctorName}
                      </CardTitle>
                      <Badge
                        className={`mt-2 ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        #{appointment.queueNumber}
                      </div>
                      <p className="text-xs text-gray-500">Navbat</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString(
                          "uz-UZ",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{appointment.time}</span>
                    </div>

                    {appointment.symptoms && (
                      <div className="flex items-start gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="text-gray-600">
                          {appointment.symptoms}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">
                        Navbat kelishiga taxminan 30 daqiqa qolganda sizga xabar
                        beramiz
                      </p>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Navbatni bekor qilish
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Navbatni bekor qilish
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Haqiqatan ham bu navbatni bekor qilmoqchimisiz? Bu
                              amalni ortga qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Yo'q</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancel(appointment.id)}
                            >
                              Ha, bekor qilish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tarix */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="font-bold text-xl mb-4 text-gray-600">Tarix</h2>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-75">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-400">
                        #{appointment.queueNumber}
                      </div>
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(appointment.date).toLocaleDateString(
                              "uz-UZ",
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
