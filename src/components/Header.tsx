import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import * as PushAPI from "@pushprotocol/restapi";

export function Header() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [userId, setUserId] = useState("");
  const { disconnect } = useDisconnect();
  const [unreadCount, setUnreadCount] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New message",
      description: "You have a new message from John Doe.",
      time: "1 minute ago",
    },
    {
      id: 2,
      title: "New friend request",
      description: "You have a friend request from Jane Smith.",
      time: "2 hours ago",
    },
  ]);

  const fetchNotifs = async () => {
    const notifications = await PushAPI.user.getFeeds({
      user: "eip155:42:" + address,
    });

    console.log("Notifications: \n", notifications);
  };

  const handleNotificationClick = () => {
    setUnreadCount(0);
    setShowNotifications(true);
  };

  const handleNotificationClear = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const logout = () => {
    disconnect();
    if (router.pathname === "/me") {
      router.replace("/");
    }
  };

  useEffect(() => {
    if (isConnected) {
      console.log("Connected:", address);
      fetchNotifs();

      fetch(`/api/user/${address}`, {
        method: "GET",
      })
        .then(async (response) => {
          if (response.ok) {
            let json = await response.json();
            Cookies.set("id", json.id);
            if (json.redirect && router.pathname !== "/me") {
              router.push({
                pathname: "/me",
                query: { init: true },
              });
            }
          } else {
            console.error("GET /api/user/:address failed");
          }
        })
        .catch((error) => {
          console.error("GET /api/user/:address error:", error);
        });
    } else {
      if (router.pathname === "/me") {
        router.replace("/");
      }
    }
  }, [isConnected]);

  return (
    <header>
      <Head>
        <title>Foundly | De-Lost and Found</title>
        <meta name="description" content="Decentralized Lost and Found" />
      </Head>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo_small.png"
              className="mr-3 h-6 sm:h-9"
              alt="Foundly Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Foundly
            </span>
          </Link>
          <div className="flex items-center lg:order-3">
            <div className="relative mr-2.5">
              <button
                className="focus:outline-none font-medium rounded-lg text-xl text-center inline-flex items-center mr-2"
                onClick={handleNotificationClick}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0  transition-opacity"
                    onClick={handleNotificationClear}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-bold text-gray-800">
                        Notifications
                      </h2>
                    </div>
                    {notifications.length === 0 && (
                      <p className="px-4 py-2">No notifications to show.</p>
                    )}
                    {notifications.length > 0 && (
                      <ul>
                        {notifications.map((notification) => (
                          <li key={notification.id}>
                            <div className="px-4 py-2 border-b">
                              <h3 className="text-lg font-bold text-gray-800">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex justify-end p-4 border-t">
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={handleNotificationClear}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus="icon"
              showBalance={false}
            /> */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");
                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 mr-2"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2">
                              Me
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="px-2 py-2 flex flex-col text-right">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={openAccountModal}
                                      type="button"
                                      className="px-2 py-2 text-right"
                                    >
                                      {account.ensName || account.displayName}
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link href="/me" className="px-2 py-2">
                                      Edit profile
                                    </Link>
                                  )}
                                </Menu.Item>
                              </div>
                              <div className="px-1 py-1 flex flex-col text-right">
                                <Menu.Item>
                                  <button
                                    onClick={logout}
                                    className="px-2 py-2 text-sm text-right"
                                  >
                                    Log out
                                  </button>
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            <Link
              className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80"
              href="/report"
            >
              Report
            </Link>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 "
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  href="/losts"
                >
                  Losts
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  href="/founds"
                >
                  Founds
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  href="/halloffame"
                >
                  Hall of Fame
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
