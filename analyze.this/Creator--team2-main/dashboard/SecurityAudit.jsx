import React, { useState } from "react";

import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Clock,
  UserCheck,
  Lock,
  Monitor,
  LogOut,
Smartphone,
MapPin,
KeyRound,
ShieldAlert,
Globe,
Ban,
Wifi,
Gauge,
RefreshCw,
Settings,
Timer,
BellRing,
ServerCog,
Save,
} from "lucide-react";


const auditLogs = [

  {
    id: 1,
    action: "User Account Approved",
    user: "CreativeHub Agency",
    type: "Success",
    time: "10 minutes ago",
    icon: UserCheck,
  },

  {
    id: 2,
    action: "Administrator Settings Updated",
    user: "System Admin",
    type: "Success",
    time: "35 minutes ago",
    icon: ShieldCheck,
  },

  {
    id: 3,
    action: "Suspicious Login Detected",
    user: "Unknown Device",
    type: "Warning",
    time: "1 hour ago",
    icon: AlertTriangle,
  },

  {
    id: 4,
    action: "User Account Suspended",
    user: "Arun Kumar",
    type: "Warning",
    time: "2 hours ago",
    icon: Lock,
  },

  {
    id: 5,
    action: "Secure Login Completed",
    user: "Priya Marketing",
    type: "Success",
    time: "3 hours ago",
    icon: CheckCircle2,
  },

];


function SecurityAudit() {

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");


  const filteredLogs =

    auditLogs.filter((log) => {

      const searchMatch =

        log.action
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        log.user
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const filterMatch =

        filter === "All" ||

        log.type === filter;


      return (
        searchMatch &&
        filterMatch
      );

    });
    const [sessions, setSessions] = useState([
  {
    id: 1,
    device: "Windows PC",
    location: "Chennai, India",
    browser: "Microsoft Edge",
    status: "Current",
  },
  {
    id: 2,
    device: "Android Mobile",
    location: "Thanjavur, India",
    browser: "Chrome",
    status: "Active",
  },
  {
    id: 3,
    device: "MacBook",
    location: "Bengaluru, India",
    browser: "Safari",
    status: "Active",
  },
]);

const [securityMessage, setSecurityMessage] =
  useState("");
const removeSession = (sessionId) => {

  setSessions((currentSessions) =>
    currentSessions.filter(
      (session) =>
        session.id !== sessionId
    )
  );

  setSecurityMessage(
    "Session logged out successfully."
  );

};

const logoutAllSessions = () => {

  setSessions((currentSessions) =>
    currentSessions.filter(
      (session) =>
        session.status === "Current"
    )
  );

  setSecurityMessage(
    "All other sessions were logged out."
  );

};
const [suspiciousLogins, setSuspiciousLogins] =
  useState([

    {
      id: 1,
      ip: "185.220.101.45",
      location: "Unknown Location",
      device: "Unknown Windows Device",
      attempts: 12,
      risk: "High",
      status: "Under Review",
    },

    {
      id: 2,
      ip: "103.145.32.18",
      location: "Mumbai, India",
      device: "Android Chrome",
      attempts: 6,
      risk: "Medium",
      status: "Under Review",
    },

    {
      id: 3,
      ip: "91.108.4.22",
      location: "Bengaluru, India",
      device: "Windows Chrome",
      attempts: 3,
      risk: "Low",
      status: "Under Review",
    },

  ]);
  const blockIPAddress = (loginId) => {

  setSuspiciousLogins(
    (currentLogins) =>

      currentLogins.map((login) =>

        login.id === loginId

          ? {
              ...login,
              status: "Blocked",
            }

          : login

      )

  );

  setSecurityMessage(
    "IP address blocked successfully."
  );

};
const [passwordUsers, setPasswordUsers] =
  useState([
    {
      id: 1,
      user: "Arun Kumar",
      email: "arun@gmail.com",
      strength: "Weak",
      lastChanged: "145 days ago",
      resetRequired: false,
    },

    {
      id: 2,
      user: "Priya Marketing",
      email: "priya@marketing.com",
      strength: "Medium",
      lastChanged: "92 days ago",
      resetRequired: false,
    },

    {
      id: 3,
      user: "CreativeHub Agency",
      email: "creativehub@gmail.com",
      strength: "Weak",
      lastChanged: "180 days ago",
      resetRequired: false,
    },

    {
      id: 4,
      user: "Kavin Raj",
      email: "kavin@gmail.com",
      strength: "Strong",
      lastChanged: "24 days ago",
      resetRequired: false,
    },
  ]);
  const forcePasswordReset = (userId) => {

  setPasswordUsers((currentUsers) =>
    currentUsers.map((user) =>
      user.id === userId
        ? {
            ...user,
            resetRequired: true,
          }
        : user
    )
  );

  setSecurityMessage(
    "Password reset request sent successfully."
  );

};
const [securitySettings, setSecuritySettings] =
  useState({
    mandatory2FA: true,
    autoLock: true,
    suspiciousAlerts: true,
    deviceVerification: true,
    maintenanceMode: false,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
  });
  const toggleSecuritySetting = (setting) => {

  setSecuritySettings((currentSettings) => ({

    ...currentSettings,

    [setting]:
      !currentSettings[setting],

  }));

};
const saveSecuritySettings = () => {

  setSecurityMessage(
    "Advanced security policy saved successfully."
  );

};
  return (

    <div className="space-y-7">
     {securityMessage && (

  <div className="flex items-center justify-between gap-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">

    <div className="flex items-center gap-3">

      <CheckCircle2 size={21} />

      <p className="font-semibold">

        {securityMessage}

      </p>

    </div>

    <button
      type="button"
      onClick={() =>
        setSecurityMessage("")
      }
      className="font-bold"
    >
      ×
    </button>

  </div>

)}
      {/* HEADER */}

      <div>

        <p className="text-blue-600 font-semibold">

          Platform Security

        </p>

        <h1 className="text-3xl font-bold mt-1">

          Security & Audit Logs

        </h1>

        <p className="text-gray-500 mt-2">

          Monitor administrator actions,
          user activity and important
          platform security events.

        </p>

      </div>


      {/* SECURITY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">


        <div className="bg-white border rounded-2xl p-6">

          <ShieldCheck
            className="text-green-600"
            size={27}
          />

          <p className="text-gray-500 mt-5">

            Security Score

          </p>

          <h2 className="text-3xl font-bold">

            92%

          </h2>

          <p className="text-green-600 text-sm mt-2">

            Platform protected

          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <Monitor
            className="text-blue-600"
            size={27}
          />

          <p className="text-gray-500 mt-5">

            Active Sessions

          </p>

          <h2 className="text-3xl font-bold">

            1,248

          </h2>

          <p className="text-blue-600 text-sm mt-2">

            Currently online

          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <AlertTriangle
            className="text-orange-600"
            size={27}
          />

          <p className="text-gray-500 mt-5">

            Security Alerts

          </p>

          <h2 className="text-3xl font-bold">

            7

          </h2>

          <p className="text-orange-600 text-sm mt-2">

            Requires review

          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <Clock
            className="text-purple-600"
            size={27}
          />

          <p className="text-gray-500 mt-5">

            Audit Events

          </p>

          <h2 className="text-3xl font-bold">

            428

          </h2>

          <p className="text-purple-600 text-sm mt-2">

            This month

          </p>

        </div>


      </div>


      {/* SEARCH */}

      <div className="bg-white border rounded-2xl p-5">

        <div className="flex flex-col md:flex-row gap-4">


          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input

              type="text"

              value={search}

              onChange={(event) =>

                setSearch(
                  event.target.value
                )

              }

              placeholder="Search audit activity..."

              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"

            />

          </div>


          <select

            value={filter}

            onChange={(event) =>

              setFilter(
                event.target.value
              )

            }

            className="border rounded-xl px-4 py-3 bg-white"

          >

            <option value="All">

              All Events

            </option>

            <option value="Success">

              Successful Events

            </option>

            <option value="Warning">

              Security Warnings

            </option>

          </select>


        </div>

      </div>


      {/* AUDIT LOG TABLE */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">

            Recent Audit Activity

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            {filteredLogs.length}
            {" "}events found

          </p>

        </div>


        <div className="divide-y">


          {filteredLogs.map((log) => {

            const Icon = log.icon;


            return (

              <div

                key={log.id}

                className="flex items-center justify-between gap-5 p-5 hover:bg-gray-50"

              >


                <div className="flex items-center gap-4">


                  <div

                    className={
                      log.type === "Success"

                        ? "w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center"

                        : "w-11 h-11 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center"
                    }

                  >

                    <Icon size={21} />

                  </div>


                  <div>

                    <p className="font-semibold">

                      {log.action}

                    </p>

                    <p className="text-sm text-gray-500">

                      {log.user}

                    </p>

                  </div>


                </div>


                <div className="text-right">

                  <span

                    className={
                      log.type === "Success"

                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

                        : "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    }

                  >

                    {log.type}

                  </span>

                  <p className="text-xs text-gray-400 mt-2">

                    {log.time}

                  </p>

                </div>


              </div>

            );

          })}


        </div>

      </div>
<div className="bg-white border rounded-2xl p-6 shadow-sm">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>

      <div className="flex items-center gap-3">

        <Smartphone
          className="text-blue-600"
          size={25}
        />

        <div>

          <h2 className="text-xl font-bold">

            Active Device Sessions

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            Review devices currently
            connected to the platform.

          </p>

        </div>

      </div>

    </div>

    <button
      type="button"
      onClick={logoutAllSessions}
      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold"
    >

      <LogOut size={18} />

      Logout Other Devices

    </button>

  </div>


  <div className="mt-6 space-y-4">

    {sessions.map((session) => (

      <div
        key={session.id}
        className="border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">

            <Monitor size={21} />

          </div>

          <div>

            <div className="flex items-center gap-3">

              <p className="font-bold">

                {session.device}

              </p>

              <span
                className={
                  session.status === "Current"

                    ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"

                    : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                }
              >

                {session.status}

              </span>

            </div>

            <p className="text-sm text-gray-500 mt-2">

              {session.browser}

            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

              <MapPin size={15} />

              {session.location}

            </div>

          </div>

        </div>


        {session.status !== "Current" && (

          <button
            type="button"
            onClick={() =>
              removeSession(session.id)
            }
            className="flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold"
          >

            <LogOut size={17} />

            Logout

          </button>

        )}

      </div>

    ))}

  </div>

</div>
{/* SUSPICIOUS LOGIN DETECTION */}

<div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

  <div className="p-6 border-b">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center">

          <ShieldAlert size={24} />

        </div>

        <div>

          <h2 className="text-xl font-bold">

            Suspicious Login Detection

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            Review unusual login activity
            and block risky IP addresses.

          </p>

        </div>

      </div>

      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">

        {
          suspiciousLogins.filter(
            (login) =>
              login.status !== "Blocked"
          ).length
        }
        {" "}Active Alerts

      </span>

    </div>

  </div>


  <div className="overflow-x-auto">

    <table className="w-full min-w-[900px]">

      <thead className="bg-gray-50">

        <tr>

          <th className="text-left p-4">

            IP Address

          </th>

          <th className="text-left p-4">

            Location

          </th>

          <th className="text-left p-4">

            Device

          </th>

          <th className="text-left p-4">

            Attempts

          </th>

          <th className="text-left p-4">

            Risk

          </th>

          <th className="text-left p-4">

            Status

          </th>

          <th className="text-left p-4">

            Action

          </th>

        </tr>

      </thead>


      <tbody>

        {suspiciousLogins.map(
          (login) => (

            <tr
              key={login.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">

                <div className="flex items-center gap-2 font-semibold">

                  <Wifi
                    size={17}
                    className="text-blue-600"
                  />

                  {login.ip}

                </div>

              </td>


              <td className="p-4">

                <div className="flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-gray-400"
                  />

                  {login.location}

                </div>

              </td>


              <td className="p-4">

                {login.device}

              </td>


              <td className="p-4 font-bold">

                {login.attempts}

              </td>


              <td className="p-4">

                <span

                  className={
                    login.risk === "High"

                      ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"

                      : login.risk === "Medium"

                      ? "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold"

                      : "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                  }

                >

                  {login.risk}

                </span>

              </td>


              <td className="p-4">

                <span

                  className={
                    login.status === "Blocked"

                      ? "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold"

                      : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold"
                  }

                >

                  {login.status}

                </span>

              </td>


              <td className="p-4">

                {login.status === "Blocked"

                  ? (

                    <span className="text-green-600 font-semibold">

                      Protected

                    </span>

                  )

                  : (

                    <button

                      type="button"

                      onClick={() =>
                        blockIPAddress(
                          login.id
                        )
                      }

                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"

                    >

                      <Ban size={17} />

                      Block IP

                    </button>

                  )

                }

              </td>

            </tr>

          )

        )}

      </tbody>

    </table>

  </div>

</div>
{/* PASSWORD SECURITY */}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

  {/* SECURITY SCORE */}

  <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-2xl p-7">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-blue-200">

          Platform Security Score

        </p>

        <h2 className="text-5xl font-bold mt-3">

          87

          <span className="text-xl text-blue-200">

            /100

          </span>

        </h2>

      </div>

      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">

        <Gauge size={29} />

      </div>

    </div>

    <div className="mt-7">

      <div className="flex justify-between text-sm">

        <span>

          Security Health

        </span>

        <span>

          Strong

        </span>

      </div>

      <div className="w-full h-3 bg-white/20 rounded-full mt-2">

        <div className="w-[87%] h-3 bg-green-400 rounded-full">

        </div>

      </div>

    </div>

    <p className="text-blue-100 text-sm mt-5">

      Security is healthy. Review weak
      passwords and unusual login alerts
      to improve the score.

    </p>

  </div>


  {/* PASSWORD SUMMARY */}

  <div className="xl:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">

    <div className="flex items-center gap-3">

      <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">

        <KeyRound size={24} />

      </div>

      <div>

        <h2 className="text-xl font-bold">

          Password Security Overview

        </h2>

        <p className="text-sm text-gray-500">

          Monitor password strength
          and account security.

        </p>

      </div>

    </div>


    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7">

      <div className="border rounded-xl p-5">

        <p className="text-gray-500 text-sm">

          Strong Passwords

        </p>

        <h3 className="text-3xl font-bold text-green-600 mt-2">

          82%

        </h3>

        <div className="h-2 bg-gray-100 rounded-full mt-4">

          <div className="h-2 w-[82%] bg-green-500 rounded-full">

          </div>

        </div>

      </div>


      <div className="border rounded-xl p-5">

        <p className="text-gray-500 text-sm">

          Weak Passwords

        </p>

        <h3 className="text-3xl font-bold text-red-600 mt-2">

          11%

        </h3>

        <div className="h-2 bg-gray-100 rounded-full mt-4">

          <div className="h-2 w-[11%] bg-red-500 rounded-full">

          </div>

        </div>

      </div>


      <div className="border rounded-xl p-5">

        <p className="text-gray-500 text-sm">

          Passwords Expiring

        </p>

        <h3 className="text-3xl font-bold text-orange-600 mt-2">

          7%

        </h3>

        <div className="h-2 bg-gray-100 rounded-full mt-4">

          <div className="h-2 w-[7%] bg-orange-500 rounded-full">

          </div>

        </div>

      </div>

    </div>

  </div>

</div>


{/* PASSWORD RISK TABLE */}

<div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

  <div className="p-6 border-b">

    <div className="flex items-center gap-3">

      <AlertTriangle
        className="text-orange-600"
        size={24}
      />

      <div>

        <h2 className="text-xl font-bold">

          Password Risk Review

        </h2>

        <p className="text-sm text-gray-500">

          Review weak passwords and
          request password changes.

        </p>

      </div>

    </div>

  </div>


  <div className="overflow-x-auto">

    <table className="w-full min-w-[850px]">

      <thead className="bg-gray-50">

        <tr>

          <th className="text-left p-4">

            User

          </th>

          <th className="text-left p-4">

            Password Strength

          </th>

          <th className="text-left p-4">

            Last Changed

          </th>

          <th className="text-left p-4">

            Reset Status

          </th>

          <th className="text-left p-4">

            Action

          </th>

        </tr>

      </thead>


      <tbody>

        {passwordUsers.map((user) => (

          <tr
            key={user.id}
            className="border-t hover:bg-gray-50"
          >

            <td className="p-4">

              <p className="font-semibold">

                {user.user}

              </p>

              <p className="text-sm text-gray-500">

                {user.email}

              </p>

            </td>


            <td className="p-4">

              <span
                className={
                  user.strength === "Strong"

                    ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"

                    : user.strength === "Medium"

                    ? "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold"

                    : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
                }
              >

                {user.strength}

              </span>

            </td>


            <td className="p-4">

              {user.lastChanged}

            </td>


            <td className="p-4">

              {user.resetRequired

                ? (

                  <span className="text-green-600 font-semibold">

                    Reset Requested

                  </span>

                )

                : (

                  <span className="text-gray-500">

                    No Action

                  </span>

                )

              }

            </td>


            <td className="p-4">

              {user.resetRequired

                ? (

                  <span className="text-green-600 font-semibold">

                    Request Sent

                  </span>

                )

                : (

                  <button
                    type="button"
                    onClick={() =>
                      forcePasswordReset(
                        user.id
                      )
                    }
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold"
                  >

                    <RefreshCw size={17} />

                    Force Reset

                  </button>

                )

              }

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
{/* ADVANCED SECURITY CONTROLS */}

<div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

  {/* HEADER */}

  <div className="p-6 border-b">

    <div className="flex items-center gap-3">

      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">

        <Settings size={24} />

      </div>

      <div>

        <h2 className="text-xl font-bold">

          Advanced Security Controls

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          Configure platform authentication,
          login protection and session policies.

        </p>

      </div>

    </div>

  </div>


  <div className="p-6 space-y-5">


    {/* MANDATORY 2FA */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5">

      <div>

        <p className="font-bold">

          Mandatory Two-Factor Authentication

        </p>

        <p className="text-sm text-gray-500 mt-1">

          Require additional verification
          for all administrator accounts.

        </p>

      </div>

      <button

        type="button"

        onClick={() =>
          toggleSecuritySetting(
            "mandatory2FA"
          )
        }

        className={
          securitySettings.mandatory2FA

            ? "w-14 h-8 rounded-full bg-green-600 p-1"

            : "w-14 h-8 rounded-full bg-gray-300 p-1"
        }

      >

        <div

          className={
            securitySettings.mandatory2FA

              ? "w-6 h-6 rounded-full bg-white translate-x-6 transition"

              : "w-6 h-6 rounded-full bg-white transition"
          }

        />

      </button>

    </div>


    {/* AUTO ACCOUNT LOCK */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5">

      <div>

        <p className="font-bold">

          Automatic Account Lock

        </p>

        <p className="text-sm text-gray-500 mt-1">

          Lock accounts after repeated
          failed login attempts.

        </p>

      </div>

      <button

        type="button"

        onClick={() =>
          toggleSecuritySetting(
            "autoLock"
          )
        }

        className={
          securitySettings.autoLock

            ? "w-14 h-8 rounded-full bg-green-600 p-1"

            : "w-14 h-8 rounded-full bg-gray-300 p-1"
        }

      >

        <div

          className={
            securitySettings.autoLock

              ? "w-6 h-6 rounded-full bg-white translate-x-6 transition"

              : "w-6 h-6 rounded-full bg-white transition"
          }

        />

      </button>

    </div>


    {/* SUSPICIOUS ALERTS */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5">

      <div>

        <p className="font-bold">

          Suspicious Login Alerts

        </p>

        <p className="text-sm text-gray-500 mt-1">

          Send an alert when unusual
          login behavior is detected.

        </p>

      </div>

      <button

        type="button"

        onClick={() =>
          toggleSecuritySetting(
            "suspiciousAlerts"
          )
        }

        className={
          securitySettings.suspiciousAlerts

            ? "w-14 h-8 rounded-full bg-green-600 p-1"

            : "w-14 h-8 rounded-full bg-gray-300 p-1"
        }

      >

        <div

          className={
            securitySettings.suspiciousAlerts

              ? "w-6 h-6 rounded-full bg-white translate-x-6 transition"

              : "w-6 h-6 rounded-full bg-white transition"
          }

        />

      </button>

    </div>


    {/* NEW DEVICE VERIFICATION */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5">

      <div>

        <p className="font-bold">

          New Device Verification

        </p>

        <p className="text-sm text-gray-500 mt-1">

          Require verification when users
          sign in from a new device.

        </p>

      </div>

      <button

        type="button"

        onClick={() =>
          toggleSecuritySetting(
            "deviceVerification"
          )
        }

        className={
          securitySettings.deviceVerification

            ? "w-14 h-8 rounded-full bg-green-600 p-1"

            : "w-14 h-8 rounded-full bg-gray-300 p-1"
        }

      >

        <div

          className={
            securitySettings.deviceVerification

              ? "w-6 h-6 rounded-full bg-white translate-x-6 transition"

              : "w-6 h-6 rounded-full bg-white transition"
          }

        />

      </button>

    </div>


    {/* SESSION SETTINGS */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


      <div className="border rounded-xl p-5">

        <div className="flex items-center gap-2">

          <Timer
            size={20}
            className="text-blue-600"
          />

          <p className="font-bold">

            Session Timeout

          </p>

        </div>

        <p className="text-sm text-gray-500 mt-2">

          Automatically log out inactive users.

        </p>

        <select

          value={
            securitySettings.sessionTimeout
          }

          onChange={(event) =>

            setSecuritySettings(
              (currentSettings) => ({

                ...currentSettings,

                sessionTimeout:
                  event.target.value,

              })
            )

          }

          className="w-full border rounded-xl px-4 py-3 mt-4 bg-white"

        >

          <option value="15">

            15 minutes

          </option>

          <option value="30">

            30 minutes

          </option>

          <option value="60">

            1 hour

          </option>

          <option value="120">

            2 hours

          </option>

        </select>

      </div>


      <div className="border rounded-xl p-5">

        <div className="flex items-center gap-2">

          <ShieldAlert
            size={20}
            className="text-orange-600"
          />

          <p className="font-bold">

            Maximum Login Attempts

          </p>

        </div>

        <p className="text-sm text-gray-500 mt-2">

          Lock accounts after this limit.

        </p>

        <select

          value={
            securitySettings.maxLoginAttempts
          }

          onChange={(event) =>

            setSecuritySettings(
              (currentSettings) => ({

                ...currentSettings,

                maxLoginAttempts:
                  event.target.value,

              })
            )

          }

          className="w-full border rounded-xl px-4 py-3 mt-4 bg-white"

        >

          <option value="3">

            3 attempts

          </option>

          <option value="5">

            5 attempts

          </option>

          <option value="10">

            10 attempts

          </option>

        </select>

      </div>

    </div>


    {/* MAINTENANCE MODE */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-orange-50 border border-orange-200 rounded-xl p-5">

      <div className="flex gap-3">

        <ServerCog
          className="text-orange-600"
          size={23}
        />

        <div>

          <p className="font-bold">

            Maintenance Mode

          </p>

          <p className="text-sm text-gray-600 mt-1">

            Temporarily restrict platform
            access during system maintenance.

          </p>

        </div>

      </div>

      <button

        type="button"

        onClick={() =>
          toggleSecuritySetting(
            "maintenanceMode"
          )
        }

        className={
          securitySettings.maintenanceMode

            ? "w-14 h-8 rounded-full bg-orange-600 p-1"

            : "w-14 h-8 rounded-full bg-gray-300 p-1"
        }

      >

        <div

          className={
            securitySettings.maintenanceMode

              ? "w-6 h-6 rounded-full bg-white translate-x-6 transition"

              : "w-6 h-6 rounded-full bg-white transition"
          }

        />

      </button>

    </div>


    {/* SAVE */}

    <div className="flex justify-end pt-2">

      <button

        type="button"

        onClick={
          saveSecuritySettings
        }

        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"

      >

        <Save size={19} />

        Save Security Policy

      </button>

    </div>

  </div>

</div>

      {/* AI SECURITY INSIGHT */}

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-7 text-white">

        <div className="flex gap-4">

          <ShieldCheck size={30} />

          <div>

            <p className="text-blue-200">

              AI Security Insight

            </p>

            <h2 className="text-xl font-bold mt-1">

              Platform security is stable

            </h2>

            <p className="text-blue-100 mt-3">

              Most platform activity is secure.
              Seven unusual login attempts were
              detected and should be reviewed
              by an administrator.

            </p>

          </div>

        </div>

      </div>


    </div>

  );

}


export default SecurityAudit;