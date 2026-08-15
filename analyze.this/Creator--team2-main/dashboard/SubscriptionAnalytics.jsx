import {
  Users,
  UserPlus,
  UserMinus,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const stats = [
  {
    title: "Total Subscribers",
    value: "124,860",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Premium Members",
    value: "8,420",
    icon: UserPlus,
    color: "bg-purple-500",
  },
  {
    title: "Monthly Income",
    value: "$12,450",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    title: "Cancelled Members",
    value: "342",
    icon: UserMinus,
    color: "bg-red-500",
  },
];

const growth = [
  { month: "Jan", subscribers: 4200 },
  { month: "Feb", subscribers: 5100 },
  { month: "Mar", subscribers: 6200 },
  { month: "Apr", subscribers: 7100 },
  { month: "May", subscribers: 8500 },
  { month: "Jun", subscribers: 9700 },
  { month: "Jul", subscribers: 11000 },
];

const SubscriptionAnalytics = () => {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Subscription Analytics
        </h2>

        <p className="text-gray-500">
          Monitor premium membership growth and subscription income.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item,index)=>{

          const Icon=item.icon;

          return(

            <div
              key={index}
              className="bg-white rounded-xl shadow p-5"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                >
                  <Icon size={24}/>
                </div>

              </div>

            </div>

          )

        })}

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <h3 className="text-xl font-bold mb-5">
          Subscriber Growth
        </h3>

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={growth}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="month"/>

            <YAxis/>

            <Tooltip/>

            <Area
              type="monotone"
              dataKey="subscribers"
              stroke="#3B82F6"
              fill="#93C5FD"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default SubscriptionAnalytics;