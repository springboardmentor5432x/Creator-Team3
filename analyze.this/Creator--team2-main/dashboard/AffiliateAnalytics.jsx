import {
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const affiliateStats = [
  {
    title: "Affiliate Earnings",
    value: "$14,820",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    title: "Affiliate Clicks",
    value: "48,620",
    icon: MousePointerClick,
    color: "bg-blue-500",
  },
  {
    title: "Conversions",
    value: "2,460",
    icon: ShoppingCart,
    color: "bg-purple-500",
  },
  {
    title: "Conversion Rate",
    value: "5.1%",
    icon: TrendingUp,
    color: "bg-orange-500",
  },
];

const affiliateProducts = [
  {
    product: "Canon Camera",
    clicks: "8,420",
    sales: 285,
    revenue: "$3,250",
  },
  {
    product: "MacBook Pro",
    clicks: "6,120",
    sales: 142,
    revenue: "$2,980",
  },
  {
    product: "Blue Yeti Mic",
    clicks: "4,860",
    sales: 198,
    revenue: "$1,920",
  },
  {
    product: "Sony Headphones",
    clicks: "3,980",
    sales: 156,
    revenue: "$1,450",
  },
  {
    product: "LED Ring Light",
    clicks: "2,740",
    sales: 210,
    revenue: "$1,180",
  },
];

const AffiliateAnalytics = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Affiliate Marketing
        </h2>

        <p className="text-gray-500">
          Monitor affiliate product performance and commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {affiliateStats.map((item,index)=>{

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

          );

        })}

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <h3 className="text-xl font-bold mb-5">
          Top Affiliate Products
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Product
                </th>

                <th>Clicks</th>

                <th>Sales</th>

                <th>Revenue</th>

              </tr>

            </thead>

            <tbody>

              {affiliateProducts.map((item,index)=>(

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4 font-semibold">
                    {item.product}
                  </td>

                  <td className="text-center">
                    {item.clicks}
                  </td>

                  <td className="text-center">
                    {item.sales}
                  </td>

                  <td className="text-center font-bold text-green-600">
                    {item.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AffiliateAnalytics;