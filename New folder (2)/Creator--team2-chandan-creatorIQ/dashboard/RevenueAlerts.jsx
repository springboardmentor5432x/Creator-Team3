import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Bell,
} from "lucide-react";

const alerts = [
  {
    title: "Revenue Target Reached",
    description: "72% of your monthly revenue goal has been achieved.",
    type: "success",
    icon: CheckCircle,
  },
  {
    title: "Pending Sponsorship Payment",
    description: "Amazon campaign payment of $2,800 is pending.",
    type: "warning",
    icon: AlertTriangle,
  },
  {
    title: "RPM Increased",
    description: "Average RPM increased by 12% compared to last month.",
    type: "info",
    icon: TrendingUp,
  },
  {
    title: "Affiliate Revenue Dropped",
    description: "Affiliate earnings decreased by 8% this week.",
    type: "danger",
    icon: TrendingDown,
  },
  {
    title: "New Brand Collaboration",
    description: "Nike accepted your sponsorship proposal.",
    type: "success",
    icon: Bell,
  },
];

const styles = {
  success: "bg-green-50 border-green-500 text-green-700",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
  info: "bg-blue-50 border-blue-500 text-blue-700",
  danger: "bg-red-50 border-red-500 text-red-700",
};

const RevenueAlerts = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Revenue Alerts
        </h2>

        <p className="text-gray-500">
          Important notifications and revenue updates.
        </p>
      </div>

      <div className="space-y-4">

        {alerts.map((alert, index) => {

          const Icon = alert.icon;

          return (

            <div
              key={index}
              className={`border-l-4 rounded-xl p-5 flex gap-4 ${styles[alert.type]}`}
            >

              <Icon size={28} />

              <div>

                <h3 className="font-bold">
                  {alert.title}
                </h3>

                <p className="mt-1">
                  {alert.description}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default RevenueAlerts;