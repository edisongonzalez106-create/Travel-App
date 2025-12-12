import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  createContext, 
  useContext, 
  memo
} from 'react';
import { 
  Plane, Hotel, Car, Utensils, Camera, MapPin, ShoppingBag, 
  Check, Plus, Trash2, Video, ChevronDown, 
  X, Clock, Globe, 
  Search, Edit3, GripVertical, Calendar, 
  Upload, Link, LayoutGrid, AlertTriangle, CheckCircle2,
  Pencil
} from 'lucide-react';

type Category = 'Vuelo' | 'Alojamiento' | 'Transporte' | 'Comida' | 'Actividad' | 'Cultura' | 'Excursión' | 'Compras' | 'Otro';

interface Activity {
  id: string;
  date: string;
  title: string;
  cost: number;
  category: Category;
  timeStart?: string;
  timeEnd?: string;
  completed: boolean;
  notes?: string;
  script?: string;
  provider?: string;
}

interface Trip {
  id: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  currency: string;
  activities: Activity[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatMoney = (amount: number, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Vuelo: { color: "text-sky-600", bg: "bg-sky-50", icon: Plane },
  Alojamiento: { color: "text-indigo-600", bg: "bg-indigo-50", icon: Hotel },
  Transporte: { color: "text-amber-600", bg: "bg-amber-50", icon: Car },
  Comida: { color: "text-emerald-600", bg: "bg-emerald-50", icon: Utensils },
  Actividad: { color: "text-rose-600", bg: "bg-rose-50", icon: Camera },
  Cultura: { color: "text-purple-600", bg: "bg-purple-50", icon: MapPin },
  Excursión: { color: "text-teal-600", bg: "bg-teal-50", icon: MapPin },
  Compras: { color: "text-pink-600", bg: "bg-pink-50", icon: ShoppingBag },
  Otro: { color: "text-slate-500", bg: "bg-slate-100", icon: MapPin },
  Default: { color: "text-slate-600", bg: "bg-slate-50", icon: MapPin }
};

const GALLERY_IMAGES = [
  { id: 'g1', url: "https://picsum.photos/seed/adventure/1200/800", label: "Aventura" },
  { id: 'g2', url: "https://picsum.photos/seed/beach/1200/800", label: "Playa" },
  { id: 'g3', url: "https://picsum.photos/seed/city/1200/800", label: "Ciudad" },
  { id: 'g4', url: "https://picsum.photos/seed/mountain/1200/800", label: "Montaña" },
  { id: 'g5', url: "https://picsum.photos/seed/paris/1200/800", label: "París" },
  { id: 'g6', url: "https://picsum.photos/seed/newyork/1200/800", label: "NYC" },
  { id: 'g7', url: "https://picsum.photos/seed/tokyo/1200/800", label: "Tokio" },
  { id: 'g8', url: "https://picsum.photos/seed/mexico/1200/800", label: "México" },
  { id: 'g9', url: "https://picsum.photos/seed/rome/1200/800", label: "Roma" },
  { id: 'g10', url: "https://picsum.photos/seed/miami/1200/800", label: "Miami" },
  { id: 'g11', url: "https://picsum.photos/seed/sanjuan/1200/800", label: "San Juan" }
];

const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip_ny_2026",
    destination: "New York",
    coverImage: "https://picsum.photos/seed/newyork/1200/800",
    startDate: "2026-01-30",
    endDate: "2026-02-09",
    currency: "USD",
    activities: [
      { id: "ny_1", date: "2026-01-30", title: "✈️ Vuelo SDQ - EWR", cost: 116.50, category: "Vuelo", timeStart: "06:10", timeEnd: "09:30", completed: false, provider: "Arajet" },
      { id: "ny_2", date: "2026-01-30", title: "🚇 NJ Transit + AirTrain", cost: 13.25, category: "Transporte", timeStart: "10:00", timeEnd: "11:00", completed: false, provider: "Transporte publico" },
      { id: "ny_3", date: "2026-01-30", title: "🏨 HI NYC Hostel", cost: 77.00, category: "Alojamiento", completed: false, provider: "Booking" },
      { id: "ny_4", date: "2026-01-30", title: "🏙️ Paseo por Times Square + Rockefeller", cost: 0, category: "Actividad", completed: false },
      { id: "ny_5", date: "2026-01-30", title: "🍕 Almuerzo 2 Bros Pizza", cost: 9.02, category: "Comida", completed: false, provider: "Cuenta Propia" },
      { id: "ny_6", date: "2026-01-30", title: "🌳 Caminata por Central Park", cost: 0, category: "Actividad", completed: false },
      { id: "ny_7", date: "2026-02-09", title: "✈️ Vuelo MIA - SDQ", cost: 116.50, category: "Vuelo", completed: false }
    ]
  },
  {
    id: "trip_mex_2026",
    destination: "México",
    coverImage: "https://picsum.photos/seed/mexico/1200/800",
    startDate: "2026-11-24",
    endDate: "2026-11-30",
    currency: "USD",
    activities: [
      { id: "mx_1", date: "2026-11-24", title: "✈️ Vuelo SDQ → NLU", cost: 189.11, category: "Vuelo", timeStart: "22:44", completed: false, provider: "Arajet" },
      { id: "mx_2", date: "2026-11-24", title: "🚕 Transporte NLU → Airbnb Polanco", cost: 18.00, category: "Transporte", completed: false },
      { id: "mx_3", date: "2026-11-24", title: "🏨 Check-in Airbnb Polanco", cost: 288.00, category: "Alojamiento", completed: false },
      { id: "mx_4", date: "2026-11-25", title: "🏛 Centro Histórico + Bellas Artes", cost: 10.00, category: "Cultura", completed: false },
      { id: "mx_5", date: "2026-11-25", title: "🛶 Paseo en trajinera de Xochimilco", cost: 25.00, category: "Excursión", completed: false },
      { id: "mx_6", date: "2026-11-26", title: "🏯 Museo Frida Kahlo (Coyoacán)", cost: 15.00, category: "Cultura", completed: false }
    ]
  },
  {
    id: "trip_mia_2026",
    destination: "Miami",
    coverImage: "https://picsum.photos/seed/miami/1200/800",
    startDate: "2026-02-27",
    endDate: "2026-03-01",
    currency: "USD",
    activities: [
      { id: "mia_1", date: "2026-02-27", title: "✈️ Vuelo SDQ - Fort Lauderdale", cost: 74.25, category: "Vuelo", timeStart: "16:27", timeEnd: "17:56", completed: false, provider: "JetBlue" },
      { id: "mia_2", date: "2026-02-27", title: "🚖 Uber FLL a Pembroke Pines", cost: 33.95, category: "Transporte", timeStart: "18:30", timeEnd: "19:05", completed: false, provider: "Uber" },
      { id: "mia_3", date: "2026-02-28", title: "☕ Desayuno en Starbucks", cost: 10.00, category: "Comida", timeStart: "08:00", completed: false },
      { id: "mia_4", date: "2026-02-28", title: "🏙️ Bayside Marketplace & Metromover", cost: 0, category: "Actividad", completed: false },
      { id: "mia_5", date: "2026-02-28", title: "🍤 Almuerzo: La Camaronera", cost: 18.00, category: "Comida", completed: false }
    ]
  },
  {
    id: "trip_sj_2026",
    destination: "San Juan",
    coverImage: "https://picsum.photos/seed/sanjuan/1200/800",
    startDate: "2026-01-24",
    endDate: "2026-01-28",
    currency: "USD",
    activities: [
      { id: "sj_1", date: "2026-01-24", title: "✈️ Vuelo SDQ → SJU", cost: 102.70, category: "Vuelo", timeStart: "15:30", timeEnd: "16:39", completed: false, provider: "Arajet" },
      { id: "sj_2", date: "2026-01-24", title: "🚖 Uber aeropuerto → Navona Studios", cost: 17.53, category: "Transporte", completed: false, provider: "Uber" },
      { id: "sj_3", date: "2026-01-24", title: "🏨 Navona Studios", cost: 240.00, category: "Alojamiento", completed: false },
      { id: "sj_4", date: "2026-01-24", title: "🏙️ Paseo por el Viejo San Juan", cost: 0, category: "Actividad", completed: false },
      { id: "sj_5", date: "2026-01-24", title: "🍽️ Almuerzo típico", cost: 15.00, category: "Comida", completed: false }
    ]
  }
];

const ToastContext = createContext<{ addToast: (msg: string, type?: ToastMessage['type']) => void } | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={cn("pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-5 fade-in", t.type === 'success' ? "bg-slate-900 text-white" : "bg-white text-slate-800 border")}>
            {t.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertTriangle size={16} />}
            <span className="text-sm font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast error");
  return ctx;
};

function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { 
      return initialValue; 
    }
  });
  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { 
      console.error(e); 
    }
  }, [key]);
  return [storedValue, setValue];
}

function useTripLogic() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips_v12_editable', INITIAL_TRIPS);
  const [activeTripId, setActiveTripId] = useState<string>(trips[0]?.id || "");
  const { addToast } = useToast();

  const activeTrip = useMemo(() => trips.find(t => t.id === activeTripId), [trips, activeTripId]);

  const addActivity = useCallback((tripId: string, activity: Omit<Activity, 'id' | 'completed'>) => {
    const newActivity: Activity = { ...activity, id: generateId(), completed: false };
    setTrips(trips.map(t => t.id === tripId ? { ...t, activities: [...t.activities, newActivity] } : t));
    addToast("Actividad agregada", "success");
  }, [trips, setTrips, addToast]);

  const updateActivity = useCallback((tripId: string, activityId: string, updates: Partial<Activity>) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, activities: t.activities.map(a => a.id === activityId ? { ...a, ...updates } : a) } : t));
  }, [trips, setTrips]);

  const deleteActivity = useCallback((tripId: string, activityId: string) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, activities: t.activities.filter(a => a.id !== activityId) } : t));
    addToast("Actividad eliminada", "info");
  }, [trips, setTrips, addToast]);

  const reorderActivities = useCallback((tripId: string, newActivities: Activity[]) => {
     setTrips(trips.map(t => t.id === tripId ? { ...t, activities: newActivities } : t));
  }, [trips, setTrips]);

  const addTrip = useCallback((destination: string, coverImage: string) => {
    const newTrip: Trip = {
      id: generateId(),
      destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      currency: 'USD',
      coverImage: coverImage || GALLERY_IMAGES[0].url,
      activities: []
    };
    setTrips([...trips, newTrip]);
    setActiveTripId(newTrip.id);
    addToast(`Viaje a ${destination} creado`, 'success');
  }, [trips, setTrips, addToast]);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, ...updates } : t));
    addToast("Viaje actualizado", "success");
  }, [trips, setTrips, addToast]);

  const deleteTrip = useCallback((tripId: string) => {
    const newTrips = trips.filter(t => t.id !== tripId);
    setTrips(newTrips);
    if (activeTripId === tripId) setActiveTripId(newTrips[0]?.id || "");
    addToast("Viaje eliminado", "success");
  }, [trips, setTrips, activeTripId, addToast]);

  return { 
    trips, 
    activeTrip, 
    activeTripId, 
    setActiveTripId, 
    addActivity, 
    updateActivity, 
    deleteActivity, 
    reorderActivities, 
    addTrip, 
    updateTrip,
    deleteTrip 
  };
}

const Button = memo(({ children, variant = "primary", size = "md", className, ...props }: any) => {
  const base = "inline-flex items-center justify-center font-bold rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg",
    secondary: "bg-white text-slate-700 border hover:bg-gray-50",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    ghost: "text-slate-500 hover:bg-slate-100"
  };
  const sizes = { 
    sm: "text-xs px-3 h-8", 
    md: "text-sm px-4 h-12", 
    icon: "p-2 h-10 w-10 rounded-full" 
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
});

const Input = memo(({ label, error, className, ...props }: any) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <input className={cn("w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all", error && "border-rose-300", className)} {...props} />
    {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
  </div>
));

const Modal = memo(({ isOpen, onClose, title, children, maxWidth = "max-w-md" }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className={cn("bg-white w-full rounded-2xl shadow-2xl z-10 animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]", maxWidth)}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
});

const ImagePicker = ({ selectedImage, onSelect }: { selectedImage: string; onSelect: (url: string) => void }) => {
  const [tab, setTab] = useState<'gallery' | 'upload' | 'link'>('gallery');
  const [customLink, setCustomLink] = useState('');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        if (typeof reader.result === 'string') onSelect(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-100">
        {[
          { id: 'gallery', label: 'Galería', icon: LayoutGrid }, 
          { id: 'upload', label: 'Subir', icon: Upload }, 
          { id: 'link', label: 'Enlace', icon: Link }
        ].map((t) => (
          <button 
            key={t.id} 
            type="button" 
            onClick={() => setTab(t.id as any)} 
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors", 
              tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="min-h-[200px]">
        {tab === 'gallery' && (
          <div className="grid grid-cols-3 gap-2">
            {GALLERY_IMAGES.map((img) => (
              <button 
                key={img.id} 
                type="button" 
                onClick={() => onSelect(img.url)} 
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden group border-2 transition-all", 
                  selectedImage === img.url ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent hover:border-gray-200"
                )}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">{img.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {tab === 'upload' && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">Arrastra una imagen</p>
          </div>
        )}
        {tab === 'link' && (
          <div className="space-y-3">
            <Input 
              placeholder="https://..." 
              value={customLink} 
              onChange={(e: any) => setCustomLink(e.target.value)} 
            />
            <Button 
              type="button" 
              className="w-full" 
              onClick={() => { if(customLink) onSelect(customLink); }}
            >
              Usar Imagen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const TripHeader = memo(({ trip, onDelete, onEdit }: { trip: Trip; onDelete: () => void; onEdit: () => void }) => (
  <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg mb-8 group">
    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10" />
    <img 
      src={trip.coverImage} 
      alt={trip.destination} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      onError={(e) => (e.target as HTMLImageElement).src = GALLERY_IMAGES[0].url} 
    />
    
    <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button 
        variant="secondary" 
        size="icon" 
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(); }} 
        className="bg-black/20 hover:bg-black/40 text-white border-transparent backdrop-blur-md"
        title="Editar portada"
      >
        <Pencil size={18} />
      </Button>
    </div>

    <div className="absolute bottom-0 left-0 p-6 z-20 w-full text-white flex justify-between items-end">
      <div>
        <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-1">
          <Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{trip.destination}</h1>
      </div>
      <Button 
        variant="danger" 
        size="icon" 
        onClick={onDelete} 
        className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-transparent text-white"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  </div>
));

const ActivityItem = memo(({ item, onUpdate, onDelete, onDragStart, onDragOver, onDrop }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Default;
  const Icon = style.icon;

  const containerClasses = cn(
    "rounded-xl border shadow-sm transition-all group relative",
    item.completed 
      ? "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100"
      : "bg-white border-gray-100 hover:shadow-md",
    isExpanded && "ring-2 ring-indigo-500/10 shadow-lg"
  );

  const textClasses = item.completed ? "text-slate-500 line-through decoration-slate-400" : "text-slate-800";
  const costClasses = item.completed 
    ? "bg-slate-100 text-slate-400 line-through" 
    : (item.cost > 0 ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-600");
    
  const badgeClasses = item.completed 
    ? "bg-slate-100 text-slate-400" 
    : cn(style.color, style.bg);

  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, item.id)} 
      onDragOver={(e) => e.preventDefault()} 
      onDrop={(e) => onDrop(e, item.id)} 
      className={containerClasses}
    >
      <div className="p-4 flex items-start gap-4">
        <div className="mt-2 text-slate-300 cursor-grab hover:text-slate-500 active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        
        <button 
          onClick={() => onUpdate(item.id, { completed: !item.completed })} 
          className={cn(
            "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", 
            item.completed 
              ? "bg-slate-400 border-slate-400"
              : "border-slate-200 hover:border-indigo-400"
          )}
        > 
          {item.completed && <Check size={14} className="text-white" strokeWidth={3} />} 
        </button>

        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-start">
            <div>
               <h4 className={cn("font-bold leading-snug transition-colors", textClasses)}>{item.title}</h4>
               {item.provider && <span className={cn("text-[10px] font-medium transition-colors", item.completed ? "text-slate-400" : "text-slate-400")}>{item.provider}</span>}
            </div>
            <span className={cn("text-xs font-bold px-2 py-1 rounded-lg transition-colors", costClasses)}>
              {item.cost > 0 ? formatMoney(item.cost) : 'Gratis'}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors", badgeClasses)}>
              <Icon size={10} /> {item.category}
            </span>
            {item.timeStart && (
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border border-gray-100 flex items-center gap-1 transition-colors", item.completed ? "bg-slate-100 text-slate-400" : "bg-slate-50 text-slate-500")}>
                <Clock size={10}/> {item.timeStart} {item.timeEnd ? `- ${item.timeEnd}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2">
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <Video size={10} /> Notas
              </label>
              <textarea 
                className="w-full bg-transparent text-sm text-slate-700 outline-none resize-none" 
                rows={2} 
                placeholder="..." 
                value={item.script || ''} 
                onChange={(e) => onUpdate(item.id, { script: e.target.value })} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50" onClick={() => onDelete(item.id)}>
                <Trash2 size={14} className="mr-1" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}, (prev, next) => prev.item === next.item);

const ActivityForm = ({ onSubmit, onCancel, initialData }: any) => {
  const [form, setForm] = useState(initialData || { title: '', cost: '', category: 'Actividad', date: '', timeStart: '', timeEnd: '' });
  const [errors, setErrors] = useState<any>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) { 
      setErrors({ 
        title: !form.title && 'Requerido', 
        date: !form.date && 'Requerido' 
      }); 
      return; 
    }
    onSubmit({ ...form, cost: Number(form.cost) });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Actividad" 
        placeholder="Ej. Vuelo..." 
        value={form.title} 
        onChange={(e: any) => setForm({...form, title: e.target.value})} 
        error={errors.title} 
        autoFocus 
      />
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Costo" 
          type="number" 
          placeholder="0.00" 
          value={form.cost} 
          onChange={(e: any) => setForm({...form, cost: e.target.value})} 
        />
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Categoría</label>
          <div className="relative">
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-800 outline-none appearance-none" 
              value={form.category} 
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              {Object.keys(CATEGORY_CONFIG).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          type="date" 
          label="Fecha" 
          value={form.date} 
          onChange={(e: any) => setForm({...form, date: e.target.value})} 
          error={errors.date} 
        />
        <div className="flex gap-2">
          <Input 
            type="time" 
            label="Inicio" 
            value={form.timeStart} 
            onChange={(e: any) => setForm({...form, timeStart: e.target.value})} 
          />
          <Input 
            type="time" 
            label="Fin" 
            value={form.timeEnd} 
            onChange={(e: any) => setForm({...form, timeEnd: e.target.value})} 
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary" className="flex-1">Guardar</Button>
      </div>
    </form>
  );
};

const TripForm = ({ onSubmit, onCancel }: any) => {
  const [destination, setDestination] = useState("");
  const [coverImage, setCoverImage] = useState(GALLERY_IMAGES[0].url);
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (destination.trim()) onSubmit(destination, coverImage); }} className="space-y-6">
      <Input 
        label="Destino" 
        placeholder="Ej. París..." 
        value={destination} 
        onChange={(e: any) => setDestination(e.target.value)} 
        autoFocus 
      />
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Portada</label>
        <ImagePicker selectedImage={coverImage} onSelect={setCoverImage} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary" className="flex-1">Crear</Button>
      </div>
    </form>
  );
};

const MainApp = () => {
  const { trips, activeTrip, activeTripId, setActiveTripId, addActivity, updateActivity, deleteActivity, reorderActivities, addTrip, updateTrip, deleteTrip } = useTripLogic();
  const [modalOpen, setModalOpen] = useState<'activity' | 'trip' | 'edit-cover' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || !activeTrip) return;
    const items = [...activeTrip.activities];
    const draggedIdx = items.findIndex(i => i.id === draggedId);
    const targetIdx = items.findIndex(i => i.id === targetId);
    if (draggedIdx !== -1 && targetIdx !== -1) {
      const [removed] = items.splice(draggedIdx, 1);
      items.splice(targetIdx, 0, removed);
      reorderActivities(activeTrip.id, items);
    }
    setDraggedId(null);
  }, [draggedId, activeTrip, reorderActivities]);

  const filtered = useMemo(() => activeTrip ? (searchTerm ? activeTrip.activities.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())) : activeTrip.activities) : [], [activeTrip, searchTerm]);
  const sortedActivities = useMemo(() => [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [filtered]);
  const grouped = useMemo(() => sortedActivities.reduce((acc, item) => { if (!acc[item.date]) acc[item.date] = []; acc[item.date].push(item); return acc; }, {} as Record<string, Activity[]>), [sortedActivities]);
  
  const stats = useMemo(() => activeTrip ? { total: activeTrip.activities.reduce((s, i) => s + i.cost, 0), count: activeTrip.activities.filter(a => a.completed).length } : { total: 0, count: 0 }, [activeTrip]);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-32 text-slate-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><Globe size={20} /></div>
            <span className="font-bold text-lg">TravelPro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {trips.map(trip => (
                <button 
                  key={trip.id} 
                  onClick={() => setActiveTripId(trip.id)} 
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", activeTripId === trip.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                  {trip.destination}
                </button>
              ))}
              <button 
                onClick={() => setModalOpen('trip')} 
                className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 pt-6 animate-in fade-in duration-500">
        {activeTrip ? (
          <>
            <TripHeader 
              trip={activeTrip} 
              onDelete={() => deleteTrip(activeTrip.id)} 
              onEdit={() => setModalOpen('edit-cover')}
            />
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Presupuesto</p>
                 <div className="text-3xl font-bold text-slate-900">{formatMoney(stats.total)}</div>
               </div>
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Progreso</p>
                 <div className="flex items-end gap-2">
                   <div className="text-3xl font-bold text-indigo-600">{stats.count}</div>
                   <div className="text-sm font-bold text-slate-400 mb-1.5">/ {activeTrip.activities.length}</div>
                 </div>
               </div>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="space-y-8">
              {Object.keys(grouped).map(date => (
                <div key={date} className="relative pl-8 border-l-2 border-dashed border-gray-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="space-y-3">
                    {grouped[date].map(item => (
                      <ActivityItem 
                        key={item.id} 
                        item={item} 
                        onUpdate={(id: string, u: any) => updateActivity(activeTrip.id, id, u)} 
                        onDelete={(id: string) => deleteActivity(activeTrip.id, id)} 
                        onDragStart={(e: any) => { e.dataTransfer.effectAllowed = "move"; setDraggedId(item.id); }} 
                        onDragOver={(e: any) => e.preventDefault()} 
                        onDrop={handleDrop} 
                      />
                    ))}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-20 opacity-50">
                  <p>No hay actividades.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">¡Bienvenido!</h2>
            <Button onClick={() => setModalOpen('trip')}>Crear Viaje</Button>
          </div>
        )}
      </main>
      {activeTrip && (
        <button 
          onClick={() => setModalOpen('activity')} 
          className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform" />
        </button>
      )}
      
      <Modal isOpen={modalOpen === 'activity'} onClose={() => setModalOpen(null)} title="Nueva Actividad">
        <ActivityForm 
          onSubmit={(data: any) => { addActivity(activeTripId, data); setModalOpen(null); }} 
          onCancel={() => setModalOpen(null)} 
          initialData={activeTrip ? { date: activeTrip.startDate } : null} 
        />
      </Modal>
      <Modal isOpen={modalOpen === 'trip'} onClose={() => setModalOpen(null)} title="Nuevo Destino" maxWidth="max-w-xl">
        <TripForm 
          onSubmit={(dest: string, img: string) => { addTrip(dest, img); setModalOpen(null); }} 
          onCancel={() => setModalOpen(null)} 
        />
      </Modal>
      <Modal isOpen={modalOpen === 'edit-cover'} onClose={() => setModalOpen(null)} title="Cambiar Portada">
        <div className="space-y-4">
          {activeTrip && (
            <ImagePicker 
              selectedImage={activeTrip.coverImage} 
              onSelect={(url) => {
                updateTrip(activeTrip.id, { coverImage: url });
                setModalOpen(null);
              }} 
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default function App() { 
  return <ToastProvider><MainApp /></ToastProvider>; 
}