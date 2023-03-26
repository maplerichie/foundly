import { useState } from "react";
import Link from "next/link";
import { Layout } from "../components/";
import categories from "../data/category.json";
import { useAccount } from "wagmi";
import {
  fetchBalance,
  readContract,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import Image from "next/image";
import { FaCircleNotch } from "react-icons/fa";
import { ERC20_ABI, APE_ADDR, FOUNDLY_ABI, FOUNDLY_ADDR } from "../constants";
import { utils } from "ethers";
import {
  publicDb,
  publicFound,
  publicLost,
  publicUser,
} from "../helpers/polybase";
import * as eth from "@polybase/eth";
import Cookies from "js-cookie";
import moment from "moment";

export default function Report() {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  // const [bountyAmount, setBountyAmount] = useState(0);
  // const [bountyCurrency, setBountyCurrency] = useState("ape");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [statusText, setStatusText] = useState("Checking balance...");
  const depositAmount = 0.005;

  const handleImageUpload = (event: any) => {
    setImage(event.target.files[0]);
  };

  // const checkAllowance = async (owner: string, spender: string) => {
  //   setStatusText("Checking allowance...");
  //   const allowance = parseFloat(
  //     utils.formatUnits(
  //       (await readContract({
  //         address: APE_ADDR,
  //         abi: ERC20_ABI,
  //         functionName: "allowance",
  //         args: [owner, spender],
  //       })) as any,
  //       18
  //     )
  //   );

  //   if (allowance >= bountyAmount) {
  //     setStatusText("Submitting report...");
  //     return true;
  //   }
  // };

  const checkBalance = async (owner: string) => {
    let obj: any = {
      address: owner,
    };
    // if (bountyCurrency === "ape") {
    //   obj["token"] = APE_ADDR;
    // }
    const balance = await fetchBalance(obj);

    // if (parseFloat(balance.formatted) > bountyAmount) {
    if (parseFloat(balance.formatted) >= depositAmount) {
      return true;
    }
  };

  const generateItemId = (
    ownerAddress: string,
    reportType: string,
    name: string,
    date: number,
    location: string
  ) => {
    const itemData = utils.solidityPack(
      ["address", "string", "string", "uint256", "string"],
      [ownerAddress, reportType, name, date, location]
    );
    return utils.keccak256(itemData);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatusText("Checking balance...");
    if (!isConnected) {
      setError("Please connect wallet");
      return;
    }
    const userId = Cookies.get("id") || "";
    const reportType = event.target.reportType.value;
    const name = event.target.itemName.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const date = moment(event.target.date.value, "YYYY-MM-DD").unix();
    const location = event.target.location.value;
    const image = event.target.image.files[0];

    if (!reportType || !name || !description || !date || !location || !image) {
      setError("Please fill out all required fields and upload a valid image");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }
    // if (bountyAmount <= 0) {
    //   setError("Insert bounty amount!");
    //   return;
    // }

    setShowProgressModal(true);
    setError("");
    if (!(await checkBalance(address?.toString() || ""))) {
      setError("Insufficient balance!");
      setShowProgressModal(false);
      return;
    } else {
      setStatusText("Please confirm the transaction...");
    }
    // if (bountyCurrency === "ape") {
    //   if (
    //     !(await checkAllowance(
    //       address?.toString() || "",
    //       "0x0A572a0aAAf39a201666dCE27328CE17bBCd8e28"
    //     ))
    //   ) {
    //     setError("Insufficient allowance!");
    //     setShowProgressModal(false);
    //     return;
    //   }
    // }
    const itemId = generateItemId(
      address?.toString() || "",
      reportType,
      name,
      date,
      location
    );
    try {
      const prepareTx = await prepareWriteContract({
        address: FOUNDLY_ADDR,
        abi: FOUNDLY_ABI,
        functionName: "reportItem",
        args: [itemId],
        overrides: {
          value: utils.parseEther(depositAmount.toString()),
        },
      });
      const tx = await writeContract(prepareTx);
      setStatusText("Waiting for confirmation...");
      tx.wait().then(async (receipt) => {
        setStatusText("Please sign the message...");
        publicDb.signer(async (data: string) => {
          const accounts = await eth.requestAccounts();
          const account = accounts[0];
          const sig = await eth.sign(data, account);
          return { h: "eth-personal-sign", sig };
        });
        if (reportType === "lost") {
          await publicLost.create([
            itemId,
            publicUser.record(userId),
            receipt.transactionHash,
            name,
            description,
            category,
            date,
            location,
          ]);
        } else {
          await publicFound.create([
            itemId,
            publicUser.record(userId),
            receipt.transactionHash,
            name,
            description,
            category,
            date,
            location,
          ]);
        }
        const formData = new FormData();
        formData.append("itemId", itemId);
        formData.append("image", image);

        fetch("/api/report", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              setError("");
              setStatusText("Report created!");
              event.target.reset();
              setTimeout(() => {
                setShowProgressModal(false);
              }, 5000);
            } else {
              console.error("Network response was not ok");
            }
          })
          .catch((error) => {
            console.error("There was a problem submitting the report", error);
            setError("There was a problem submitting the report");
          });
      });
    } catch (error: any) {
      setStatusText(error.reason || "Some error occured!");
      setTimeout(() => {
        setShowProgressModal(false);
      }, 3000);
    }
  };

  // function onBountyChange(value: string): void {
  //   setBountyCurrency(value);
  // }

  return (
    <Layout>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {/* <h1 className="text-4xl font-bold text-center mb-8">Make report</h1> */}
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-4 mb-6">
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      id="horizontal-list-radio-license"
                      type="radio"
                      value="lost"
                      name="reportType"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="horizontal-list-radio-license"
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Lost 😢
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      id="horizontal-list-radio-id"
                      type="radio"
                      value="found"
                      name="reportType"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="horizontal-list-radio-id"
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Found 😃
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Item Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="itemName"
                placeholder="Item Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                name="description"
                placeholder="Describe the item"
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="category"
              >
                {categories.map((category) => (
                  <option key={category.trim()}>{category}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="date"
                type="date"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="location"
                placeholder="Location where the item was lost"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Image
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full py-2 px-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4 right-0 text-right">
              <span className="italic text-sm text-red-400">
                Require a deposit of 0.005 ETH
              </span>
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="bounty"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bounty
              </label>
              <div className="mb-6 flex">
                <input
                  type="number"
                  id="bounty"
                  name="bounty"
                  min={bountyCurrency === "ape" ? 1 : 0.01}
                  onChange={(e) => setBountyAmount(parseFloat(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-60 pl-12 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Amount"
                />

                <select
                  id="bounty"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="category"
                  onChange={(e) => onBountyChange(e.target.value)}
                >
                  <option key="ape" value="ape">
                    APE
                  </option>
                  <option key="eth" value="eth">
                    ETH
                  </option>
                </select>
              </div>
            </div> */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded relative mt-4 ">
                <strong className="font-bold">{error}</strong>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
              <Link
                href="/"
                className="inline-block align-baseline text-sm text-blue-600 hover:text-blue-800"
              >
                Go back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showProgressModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg z-20">
            <div className="flex flex-col items-center">
              <FaCircleNotch className="animate-spin text-4xl " />
              <span>{statusText}</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
