import RevenueCards from "./RevenueCards";
import RevenueTrendChart from "./RevenueTrendChart";
import RevenueSourceChart from "./RevenueSourceChart";
import PlatformRevenueChart from "./PlatformRevenueChart";
import VideoRevenueTable from "./VideoRevenueTable";
import SponsorshipAnalytics from "./SponsorshipAnalytics";
import SubscriptionAnalytics from "./SubscriptionAnalytics";
import AffiliateAnalytics from "./AffiliateAnalytics";
import RevenuePrediction from "./RevenuePrediction";
import FinancialInsights from "./FinancialInsights";
import RevenueGoalTracker from "./RevenueGoalTracker";
import RevenueAlerts from "./RevenueAlerts";
import DownloadReports from "./DownloadReports";
const RevenueDashboard = () => {
  return (
    <div className="space-y-8 p-6">

      <div>
        <h1 className="text-3xl font-bold">
          Revenue Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor earnings, sponsorships, subscriptions and AI revenue predictions.
        </p>
      </div>

      <RevenueCards />

      <div className="grid lg:grid-cols-2 gap-6">

        <RevenueTrendChart />

        <RevenueSourceChart />

      </div>

      <PlatformRevenueChart />

      <VideoRevenueTable />

      <SponsorshipAnalytics />

      <SubscriptionAnalytics />

      <AffiliateAnalytics />

      <RevenuePrediction />

      <FinancialInsights />

      <RevenueGoalTracker />

      <RevenueAlerts />

      <DownloadReports />

    </div>
  );
};

export default RevenueDashboard;