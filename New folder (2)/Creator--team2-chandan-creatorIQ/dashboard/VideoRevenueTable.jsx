import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const videos = [
  {
    title: "AI Tutorial",
    views: "2.1M",
    watchTime: "180K hrs",
    rpm: "$4.8",
    cpm: "$6.3",
    revenue: "$10,200",
    growth: "up",
  },
  {
    title: "Python Course",
    views: "1.4M",
    watchTime: "120K hrs",
    rpm: "$5.2",
    cpm: "$7.1",
    revenue: "$7,300",
    growth: "up",
  },
  {
    title: "Data Science",
    views: "900K",
    watchTime: "80K hrs",
    rpm: "$4.3",
    cpm: "$6.0",
    revenue: "$3,900",
    growth: "down",
  },
  {
    title: "React Masterclass",
    views: "760K",
    watchTime: "72K hrs",
    rpm: "$4.6",
    cpm: "$6.5",
    revenue: "$3,420",
    growth: "up",
  },
  {
    title: "Machine Learning",
    views: "610K",
    watchTime: "55K hrs",
    rpm: "$4.1",
    cpm: "$5.9",
    revenue: "$2,760",
    growth: "down",
  },
];

const VideoRevenueTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Video Earnings
          </h2>

          <p className="text-gray-500">
            Performance of monetized videos
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Video</th>

              <th>Views</th>

              <th>Watch Time</th>

              <th>RPM</th>

              <th>CPM</th>

              <th>Revenue</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {videos.map((video,index)=>(

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4 font-semibold">
                  {video.title}
                </td>

                <td className="text-center">
                  {video.views}
                </td>

                <td className="text-center">
                  {video.watchTime}
                </td>

                <td className="text-center">
                  {video.rpm}
                </td>

                <td className="text-center">
                  {video.cpm}
                </td>

                <td className="text-center font-bold text-green-600">
                  {video.revenue}
                </td>

                <td className="text-center">

                  {video.growth==="up" ? (

                    <span className="flex justify-center text-green-600">

                      <ArrowUpRight size={20}/>

                    </span>

                  ):(
                    <span className="flex justify-center text-red-600">

                      <ArrowDownRight size={20}/>

                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="bg-green-50 rounded-xl p-5">

          <h3 className="text-gray-600">
            Highest Earning Video
          </h3>

          <p className="text-xl font-bold mt-2">
            AI Tutorial
          </p>

          <p className="text-green-600 mt-1">
            $10,200
          </p>

        </div>

        <div className="bg-red-50 rounded-xl p-5">

          <h3 className="text-gray-600">
            Lowest Earning Video
          </h3>

          <p className="text-xl font-bold mt-2">
            Machine Learning
          </p>

          <p className="text-red-600 mt-1">
            $2,760
          </p>

        </div>

        <div className="bg-blue-50 rounded-xl p-5">

          <h3 className="text-gray-600">
            Average Revenue / 1000 Views
          </h3>

          <p className="text-xl font-bold mt-2">
            $4.86
          </p>

        </div>

      </div>

    </div>
  );
};

export default VideoRevenueTable;