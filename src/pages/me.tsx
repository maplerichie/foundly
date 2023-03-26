import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "../components";
import { FaTwitter, FaDiscord, FaLinkedin } from "react-icons/fa";
import { publicDb, publicLost, publicUser } from "../helpers/polybase";
import * as eth from "@polybase/eth";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";
import { Item } from "../interface";
import { readAttestations } from "@eth-optimism/atst";
import { BigNumber, constants, utils } from "ethers";
import { attestationStation, createValue } from "../helpers/atst";
import { FaSmile } from "react-icons/fa";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import Link from "next/link";
import { toSvg } from "jdenticon";

export default function Profile() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [initError, setInitError] = useState("");
  const { address } = useAccount();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [social, setSocial] = useState([
    {
      platform: "Twitter",
      id: "",
      username: "",
    },
    {
      platform: "Discord",
      id: "",
      username: "",
    },
    {
      platform: "LinkedIn",
      id: "",
      username: "",
    },
  ]);
  const [lostListings, setLostListings] = useState<any[]>([]);
  const [foundListings, setFoundListings] = useState<any[]>([]);
  const [caseClosed, setCaseClosed] = useState(0);
  const [apeEarned, setApeEarned] = useState("0");
  const [attestations, setAttestations] = useState<any[]>([]);

  const initProfile = async (event: any) => {
    setInitError("");
    event.preventDefault();
    const name = event.target.name.value;
    const bio = event.target.bio.value;

    if (!name || !bio) {
      setInitError("Please fill out basic information");
      return;
    }
    try {
      publicDb.signer(async (data: string) => {
        const accounts = await eth.requestAccounts();
        const account = accounts[0];
        const sig = await eth.sign(data, account);
        return { h: "eth-personal-sign", sig };
      });
      const init = await publicUser.record(userId).call("init", [name, bio]);
      if (name === init.data.name && bio === init.data.bio) {
        setName(name);
        setBio(bio);
        setShowWelcomeModal(false);
      } else {
        setInitError("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setInitError(error.message ?? "Something went wrong. Please try again.");
    }
  };

  const processEvents = async (events: any) => {
    let temp: any[] = [];
    let totalApes = BigNumber.from(0);
    events.map((x: any) => {
      temp.push({
        hash: x.transactionHash,
        creator: x.args.creator,
        value: x.args.val,
      });
      totalApes = totalApes.add(x.args.val);
    });
    setCaseClosed(temp.length);
    setApeEarned(utils.formatUnits(totalApes, 18));
    setAttestations(temp);
  };

  const fetchAttestations = async () => {
    try {
      const aboutMe = attestationStation.filters.AttestationCreated(
        null,
        address,
        null,
        null
      );
      const events = await attestationStation.queryFilter(aboutMe);
      processEvents(events);
    } catch (err) {
      console.log(err);
    }
  };

  // const fetchListings = async () => {
  //   const { data } = await publicLost
  //     .where("finder", "==", publicUser.record(userId))
  //     .get();
  //   console.log(data);
  //   // setLostListings(lost);
  //   setFoundListings(data);
  // };

  const fetchUser = async (id: string) => {
    const { data } = await publicUser.record(id).get();
    if ("name" in data) {
      setName(data.name);
    }
    if ("bio" in data) {
      setBio(data.bio);
    }
    const amount = "11.123";
    let rewardAmount = 0;
    if (amount) {
      rewardAmount = parseFloat(amount);
      if (isNaN(rewardAmount) || rewardAmount <= 0) {
        console.log("Please enter a valid amount");
        return;
      }
    }
    await fetchAttestations();
  };

  useEffect(() => {
    const id = Cookies.get("id");
    if (router.query.init) {
      setUserId(id || "");
      setShowWelcomeModal(true);
    }
    async function fetchData() {
      fetchUser(id || "");
    }
    if (router.asPath === "/me" && Object.keys(router.query).length === 0) {
      fetchData();
    }
  }, [router.query.init]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center mt-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {name}
          </h1>
          <p className="text-lg text-gray-500">{address}</p>
        </div>
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">About Me</h2>
              <div className="mt-3 max-w-xl text-sm text-gray-500">
                <p>{bio}</p>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">Social</h3>
                <ul className="max-w-md space-y-1 mt-3 text-gray-500 list-none list-inside dark:text-gray-400">
                  {social.map((link, index) => (
                    <li
                      className="pb-3 sm:pb-4 flex items-center justify-center"
                      key={index}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {link.platform === "Twitter" ? (
                          <FaTwitter color="#1DA1F2" />
                        ) : link.platform === "Discord" ? (
                          <FaDiscord color="#7289da" />
                        ) : (
                          <FaLinkedin color="#0e76a8" />
                        )}
                      </div>

                      {link.id ? (
                        <a
                          key={index}
                          href={
                            link.platform === "Twitter"
                              ? `https://twitter.com/${link.id}`
                              : link.platform === "Discord"
                              ? `https://discord.com/users/${link.id}`
                              : `https://www.linkedin.com/in/${link.id}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0"
                        >
                          {link.username}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300  rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none dark:focus:ring-blue-500"
                        >
                          Connect
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Lost Listings
                </h3>
                {lostListings.length > 0 ? (
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    {lostListings.map((listing, index) => (
                      <div key={index} className="flex justify-between">
                        <p>{listing.itemName}</p>
                        <p>{listing.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 max-w-xl text-sm text-gray-500">
                    No lost listings found.
                  </p>
                )}
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Found Listings
                </h3>
                {foundListings.length > 0 ? (
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    {foundListings.map((listing, index) => (
                      <div key={index} className="flex justify-between">
                        <p>{listing.itemName}</p>
                        <p>{listing.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 max-w-xl text-sm text-gray-500">
                    No found listings found.
                  </p>
                )}
              </div> */}
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Case Closed
                </h3>
                <p className="mt-2 max-w-xl text-sm text-gray-500">
                  {caseClosed}
                </p>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Ape Earned
                </h3>
                <p className="mt-2 max-w-xl text-sm text-gray-500">
                  {apeEarned}
                </p>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Attestations
                </h3>
                {attestations.length > 0 ? (
                  <div className="mt-2 max-w-xl grid grid-cols-6 gap-4 text-gray-500">
                    {attestations.map((atte, index) => (
                      <Link
                        target={"_blank"}
                        href={
                          "https://goerli-optimism.etherscan.io/tx/" + atte.hash
                        }
                        key={index}
                        className="flex flex-col "
                      >
                        <svg
                          viewBox="0 0 160 160"
                          className="rounded-full mb-2"
                          dangerouslySetInnerHTML={{
                            __html: toSvg(atte.creator, 160),
                          }}
                        ></svg>
                        <p className="max-w-xs overflow-hidden text-overflow-ellipsis">
                          {utils.commify(utils.formatUnits(atte.value, 18))}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 max-w-xl text-gray-500 text-5xl flex items-center justify-center">
                    <BsEmojiSmileUpsideDown />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg z-20 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Welcome to Foundly</h2>

            <form onSubmit={initProfile}>
              <div className="flex flex-col mb-6">
                <label htmlFor="name" className="font-medium mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  type="text"
                  className="border border-gray-400 p-3 rounded-md"
                />
              </div>
              <div className="flex flex-col mb-6">
                <label htmlFor="bio" className="font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="border border-gray-400 p-3 rounded-md"
                ></textarea>
              </div>
              {initError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded relative mt-4 ">
                  <strong className="font-bold">{initError}</strong>
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
