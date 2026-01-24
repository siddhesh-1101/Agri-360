import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  ShoppingCart,
  ArrowRight,
  Bell,
  Search,
  MapPin,
  Star,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const mandiComparison = [
  { name: "Azadpur Mandi", location: "Delhi", banana: 24, mango: 58, papaya: 30, rating: 4.5, deliveryTime: "2-3 hrs" },
  { name: "Vashi APMC", location: "Mumbai", banana: 23, mango: 62, papaya: 32, rating: 4.2, deliveryTime: "3-4 hrs" },
  { name: "Koyambedu", location: "Chennai", banana: 22, mango: 55, papaya: 28, rating: 4.7, deliveryTime: "2-3 hrs" },
  { name: "Binny Mill", location: "Bangalore", banana: 25, mango: 65, papaya: 31, rating: 4.3, deliveryTime: "3-4 hrs" },
];

type RetailerDashboardResp = {
  success: boolean;
  data: {
    retailer: any;
    availableProduce: any[];
    orders: any[];
    stats: any;
    assignedAgents: any[];
  };
};

type ProduceResp = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: any[];
};

const RetailerDashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [availableProduce, setAvailableProduce] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    try {
      const dash = await apiFetch<RetailerDashboardResp>("/api/retailers/dashboard", { token });
      setAvailableProduce(dash.data.availableProduce || []);
      setOrders(dash.data.orders || []);
      setStats(dash.data.stats || null);
      setAgents(dash.data.assignedAgents || []);
    } catch (err: any) {
      toast({ title: "Failed to load dashboard", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder(produceIds: string[], agentId?: string) {
    if (!token) return;
    try {
      await apiFetch("/api/retailers/orders", {
        method: "POST",
        token,
        body: JSON.stringify({ produceIds, agentId }),
      });
      toast({ title: "Order placed successfully!" });
      refresh();
    } catch (err: any) {
      toast({ title: "Failed to place order", description: err.message, variant: "destructive" });
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Retailer Dashboard</h1>
                <p className="text-muted-foreground">Compare prices and source quality ripened fruits at best rates.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Price Alerts
                </Button>
                <Button size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  My Cart (2)
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for fruits, agents, or mandis..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="outline" size="lg">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Orders", value: stats?.totalOrders || "0", icon: Package, trend: null },
              { label: "Available Produce", value: stats?.availableProduceCount || "0", icon: TrendingUp, trend: "up" },
              { label: "Total Spent", value: `₹${stats?.totalSpent || 0}`, icon: TrendingDown, trend: "down" },
              { label: "Completed Orders", value: stats?.completedOrders || "0", icon: ShoppingCart, trend: null },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  {stat.trend && (
                    <span className={`text-xs ${stat.trend === "up" ? "text-destructive" : "text-success"}`}>
                      {stat.trend === "up" ? "↑ 5%" : "↓ 8%"}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Mandi Price Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Mandi Price Comparison</h2>
                  <p className="text-sm text-muted-foreground">Ripened fruit rates across major mandis</p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Live • Updated 5 min ago
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Mandi</th>
                    <th className="text-center p-4 font-semibold text-sm">🍌 Banana</th>
                    <th className="text-center p-4 font-semibold text-sm">🥭 Mango</th>
                    <th className="text-center p-4 font-semibold text-sm">🍈 Papaya</th>
                    <th className="text-center p-4 font-semibold text-sm">Rating</th>
                    <th className="text-center p-4 font-semibold text-sm">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiComparison.map((mandi, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{mandi.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {mandi.location}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${mandi.banana === Math.min(...mandiComparison.map(m => m.banana)) ? "text-success" : "text-foreground"}`}>
                          ₹{mandi.banana}/kg
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${mandi.mango === Math.min(...mandiComparison.map(m => m.mango)) ? "text-success" : "text-foreground"}`}>
                          ₹{mandi.mango}/kg
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${mandi.papaya === Math.min(...mandiComparison.map(m => m.papaya)) ? "text-success" : "text-foreground"}`}>
                          ₹{mandi.papaya}/kg
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                          <span className="text-foreground">{mandi.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-sm text-muted-foreground">{mandi.deliveryTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-success">Best rate:</span> Koyambedu - ₹22/kg for Banana
                </p>
                <Button variant="link" size="sm">
                  View All Markets <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Available Stock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Available Stock</h2>
                <p className="text-sm text-muted-foreground">From verified ripening agents</p>
              </div>

              <div className="divide-y divide-border">
                {availableProduce.slice(0, 4).map((stock, index) => (
                  <div key={stock.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {stock.farmer ? `${stock.farmer.firstName} ${stock.farmer.lastName}` : 'Unknown Farmer'}
                        </p>
                        <p className="text-xs text-muted-foreground">{stock.cropName} • {stock.quality}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        stock.status === "available" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        Available
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stock.quantity} {stock.unit}</span>
                      <span className="font-bold text-foreground">₹{stock.pricePerUnit}/{stock.unit}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => placeOrder([stock.id])}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order Now
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* My Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">My Orders</h2>
                <p className="text-sm text-muted-foreground">Track your purchases</p>
              </div>

              <div className="divide-y divide-border">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered" ? "bg-success/10 text-success" :
                        order.status === "at_agent" || order.status === "ripening" ? "bg-primary/10 text-primary" :
                        "bg-secondary/10 text-secondary"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.produce?.length || 0} items • Total: ₹{order.totalAmount}
                      </span>
                      {order.farmer && (
                        <span className="text-xs text-muted-foreground">
                          from {order.farmer.firstName} {order.farmer.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <Button variant="outline" className="w-full">
                  View All Orders <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
