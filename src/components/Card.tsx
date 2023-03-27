import Image from "next/image";
// import moment from "moment";
import moment from "moment-timezone";
import { use, useState } from "react";
import Cookies from "js-cookie";
import { prepareWriteContract, writeContract, fetchBalance } from "@wagmi/core";
import {
  publicDb,
  publicFound,
  publicLost,
  publicUser,
} from "../helpers/polybase";
import {
  ERC20_ABI,
  APE_ADDR,
  FOUNDLY_ABI,
  FOUNDLY_ADDR,
  ATST_ADDR,
  ATST_ABI,
} from "../constants";
import * as eth from "@polybase/eth";
import { useRouter } from "next/router";
import { FaCircleNotch } from "react-icons/fa";
import { toSvg } from "jdenticon";
import { utils } from "ethers";
import { createKey, createValue } from "../helpers/atst";
import { useAccount } from "wagmi";

interface Props {
  item: any;
  type: string;
}

export const Card = ({ item, type }: Props) => {
  const router = useRouter();
  const [userId, setUserId] = useState(Cookies.get("id") || "");
  const [showItemModal, setShowItemModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [itemError, setItemError] = useState("");
  const [proofError, setProofError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [matcher, setMatcher] = useState<any>({});
  const [proofId, setProofId] = useState("");
  const [statusText, setStatusText] = useState("");
  const { address } = useAccount();
  const [faucetLoading, setFaucetLoading] = useState(false);

  const callFaucet = async () => {
    setFaucetLoading(true);
    try {
      const prepareTx = await prepareWriteContract({
        address: APE_ADDR,
        abi: ERC20_ABI,
        functionName: "mintTo",
        args: [address],
      });
      const tx = await writeContract(prepareTx);
      tx.wait().then(async (receipt) => {
        setFaucetLoading(false);
      });
    } catch (error: any) {
      setProofError("Failed to call faucet. Please try again later.");
      setFaucetLoading(false);
    }
  };

  const handleShowItemModal = () => {
    setItemError("");
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    if (loading) return;
    setShowItemModal(false);
  };

  const handleShowProofModal = (matcher: any) => {
    setProofError("");
    setMatcher(matcher);
    setProofId(generateProofID(matcher.id));
    setShowProofModal(true);
  };

  const closeProofModal = () => {
    setShowProofModal(false);
  };

  const handleImageUpload = (event: any) => {
    setImage(event.target.files[0]);
  };

  const handleCancel = async () => {
    setLoading(true);
    setItemError("");
    try {
      const prepareTx = await prepareWriteContract({
        address: FOUNDLY_ADDR,
        abi: FOUNDLY_ABI,
        functionName: "cancelItem",
        args: [item.id],
      });
      const tx = await writeContract(prepareTx);
      tx.wait().then(async (receipt) => {
        publicDb.signer(async (data: string) => {
          const accounts = await eth.requestAccounts();
          const account = accounts[0];
          const sig = await eth.sign(data, account);
          return { h: "eth-personal-sign", sig };
        });
        await publicLost.record(item.id).call("cancel");
        // setShowItemModal(false);
        router.reload();
      });
    } catch (error: any) {
      setLoading(false);
      setItemError(error.reason || error.message);
    }
  };

  const generateProofID = (id: string = userId) => {
    const itemData = utils.solidityPack(["string", "string"], [item.id, id]);
    return utils.keccak256(itemData);
  };

  const handleFound = async (event: any) => {
    event.preventDefault();
    const proofId = generateProofID();
    const image = event.target.image.files[0];
    if (!image || !image.type.startsWith("image/")) {
      setItemError("Please upload a valid image");
      return;
    }
    setLoading(true);
    setItemError("");
    try {
      publicDb.signer(async (data: string) => {
        const accounts = await eth.requestAccounts();
        const account = accounts[0];
        const sig = await eth.sign(data, account);
        return { h: "eth-personal-sign", sig };
      });
      await publicLost
        .record(item.id)
        .call("match", [publicUser.record(userId)]);

      const formData = new FormData();
      formData.append("itemId", item.id);
      formData.append("owner", item.owner.id);
      formData.append("proofId", proofId);
      formData.append("image", image);
      fetch("/api/proof", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            router.reload();
          } else {
            console.error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("There was a problem submitting the proof", error);
          setItemError("There was a problem submitting the proof");
        });
    } catch (error: any) {
      setLoading(false);
      setItemError(error.reason || error.message);
    }
  };

  const handleReturn = async (event: any) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    let rewardAmount = 0;

    if (amount) {
      rewardAmount = parseFloat(amount);
      if (isNaN(rewardAmount) || rewardAmount <= 0) {
        setProofError("Please enter a valid amount");
        return;
      }
      let obj: any = {
        address: address,
        token: APE_ADDR,
      };
      const apeBalance = await fetchBalance(obj);
      if (rewardAmount > parseFloat(apeBalance.formatted)) {
        setProofError("You don't have enough APE to reward");
        return;
      }
    }

    try {
      const getRes = await fetch("/api/user/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
          id: matcher.id,
        }),
      });
      const getAddress = await getRes.json();

      setLoading(true);
      setProofError("");

      let step = 3;
      if (rewardAmount > 0) {
        step = 4;
      }

      setStatusText(`Step 1/${step}: Please sign the message...`);
      publicDb.signer(async (data: string) => {
        const accounts = await eth.requestAccounts();
        const account = accounts[0];
        const sig = await eth.sign(data, account);
        return { h: "eth-personal-sign", sig };
      });
      await publicLost
        .record(item.id)
        .call("returned", [publicUser.record(matcher.id)]);

      setStatusText(`Step 2/${step}: Please confirm the transaction...`);
      const prepareFinalize = await prepareWriteContract({
        address: FOUNDLY_ADDR,
        abi: FOUNDLY_ABI,
        functionName: "finalizeItem",
        args: [item.id, getAddress.address],
      });
      const finalizeTx = await writeContract(prepareFinalize);
      setStatusText(`Step 2/${step}: Waiting for confirmation...`);
      finalizeTx.wait().then(async (receipt) => {});

      setStatusText(`Step 3/${step}: Preparing attest...`);
      const prepareAttest = await prepareWriteContract({
        address: ATST_ADDR,
        abi: ATST_ABI,
        functionName: "attest",
        args: [
          "0x113110D042a85a3ef0e32ad4cc72653F0caC7bAC",
          createKey("foundly.reward.ape"),
          createValue(utils.parseUnits(amount, 18)),
        ],
      });
      const attestTx = await writeContract(prepareAttest);
      setStatusText(`Step 3/${step}: Waiting for attestation...`);
      attestTx.wait().then(async (receipt) => {});

      if (rewardAmount > 0) {
        setStatusText("Step 4/4: Rewarding the finder... #ApeTogetherStrong");
        const prepareRewardTx = await prepareWriteContract({
          address: APE_ADDR,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [getAddress.address, utils.parseUnits(amount, 18)],
        });
        const rewardTx = await writeContract(prepareRewardTx);
        rewardTx.wait().then(async (receipt) => {
          setStatusText("Thank you!");
          setTimeout(() => {
            router.reload();
          }, 3000);
        });
      }
    } catch (error: any) {
      setLoading(false);
      setProofError(error.reason || error.message);
    }
  };

  const test = async () => {
    const preparedTx = await prepareWriteContract({
      address: ATST_ADDR,
      abi: ATST_ABI,
      functionName: "attest",
      args: [
        "0x113110D042a85a3ef0e32ad4cc72653F0caC7bAC",
        createKey("foundly.reward.ape"),
        createValue(10),
      ],
    });

    const tx = await writeContract(preparedTx);
    const rcpt = await tx.wait();
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        onClick={handleShowItemModal}
      >
        <div className="relative w-full h-0" style={{ paddingBottom: "100%" }}>
          <Image
            src={`https://ik.imagekit.io/vyfilo2gd/items/${item.id}`}
            alt={item.name}
            width={300}
            height={300}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <p className="text-gray-600 text-right">
            {moment(parseInt(item.date) * 1000)
              .tz(moment.tz.guess())
              .format("MMMM Do YYYY")}
          </p>
        </div>
      </div>
      {showItemModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10"
            onClick={closeItemModal}
          />
          <div className="absolute flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-lg z-30">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">💡</span>
                <div className="flex">
                  <p className="text-gray-500 mr-2">Created by:</p>
                  <p className="mb-2">
                    0x
                    {(type === "lost" ? item.owner.id : item.finder.id).slice(
                      0,
                      4
                    )}
                    ...
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center mb-6">
                <Image
                  src={`https://ik.imagekit.io/vyfilo2gd/items/${item.id}`}
                  alt={item.name}
                  width={360}
                  height={360}
                />
                <div>
                  <h2 className="text-2xl font-bold m-4">{item.name}</h2>
                  <hr />
                  <p className="mb-2 mt-2">{item.description}</p>
                  <p className="mb-2">
                    <span className="text-gray-500 mr-4">📍</span>
                    {item.location}
                  </p>
                </div>
              </div>
              {item.owner.id === userId &&
                (item.status === 1 ? (
                  <>
                    <p className="text-gray-500 mb-1 text-left">Matchers:</p>
                    <div className="grid grid-cols-6 gap-4">
                      {item.matched.map((matcher: any, index: any) => (
                        <div
                          key={index}
                          className="flex justify-center items-center h-24 w-24"
                          onClick={() => handleShowProofModal(matcher)}
                        >
                          <svg
                            viewBox="0 0 100 100"
                            className="rounded-full"
                            dangerouslySetInnerHTML={{
                              __html: toSvg(matcher.id, 100),
                            }}
                          ></svg>
                        </div>
                      ))}
                    </div>
                  </>
                ) : item.status === 2 ? (
                  <>
                    <p className="text-gray-500 mb-1 text-left">Finder:</p>
                    <div className="flex justify-center items-center h-24 w-24">
                      <svg
                        viewBox="0 0 100 100"
                        className="rounded-full"
                        dangerouslySetInnerHTML={{
                          __html: toSvg(item.finder.id, 100),
                        }}
                      ></svg>
                    </div>
                  </>
                ) : (
                  <>{/* <button onClick={test}>Test me</button> */}</>
                ))}
              {itemError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded relative mt-4 ">
                  <strong className="font-bold">{itemError}</strong>
                </div>
              )}
              <div className="flex justify-end">
                {type === "lost" &&
                  (item.owner.id === userId
                    ? item.status === 0 && (
                        <button
                          className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-4 py-2"
                          disabled={loading}
                          onClick={handleCancel}
                        >
                          {loading ? (
                            <FaCircleNotch className="animate-spin text-4xl " />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )
                    : (item.status === 0 || item.status === 1) && (
                        <form onSubmit={handleFound}>
                          <div className="flex flex-col items-center">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Upload proof
                            </label>
                            <input
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={loading}
                              className="w-full py-2 px-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                            />
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mr-4"
                              disabled={loading}
                              type="submit"
                            >
                              {loading ? (
                                <FaCircleNotch className="animate-spin text-4xl " />
                              ) : (
                                "Found it!"
                              )}
                            </button>
                          </div>
                        </form>
                      ))}
              </div>
            </div>
          </div>
        </>
      )}
      {showProofModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"
            onClick={closeProofModal}
          />
          <div className="absolute flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg z-60">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">💕</span>
                <div className="flex">
                  <p className="text-gray-500 mr-2">Created by:</p>
                  <p className="mb-2">
                    0x
                    {matcher.id.slice(0, 4)}
                    ...
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-6 justify-between">
                <div className="flex flex-col mr-4">
                  <Image
                    src={`https://ik.imagekit.io/vyfilo2gd/items/${item.id}`}
                    alt={item.name}
                    width={360}
                    height={360}
                  />
                  <span className="italic">My item</span>
                </div>
                <div className="flex flex-col mr-4">
                  <Image
                    src={`https://ik.imagekit.io/vyfilo2gd/proofs/${proofId}`}
                    alt={item.name}
                    width={360}
                    height={360}
                  />
                  <span className="italic">Proof</span>
                </div>
              </div>
              <form onSubmit={handleReturn}>
                <div className="mb-4 flex flex-col">
                  <div className="flex items-center justify-end">
                    <label className="block text-gray-700 text-sm font-bold mr-4">
                      Reward
                    </label>
                    <input
                      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                      type="decimal"
                      name="amount"
                      placeholder="Amount"
                    />
                    <div className="mr-2">APE</div>
                    <Image
                      alt="ApeCoin"
                      src={
                        "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png"
                      }
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="italic flex text-sm text-gray-400 justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mr-4"
                      disabled={faucetLoading}
                      type="button"
                      onClick={callFaucet}
                    >
                      {faucetLoading ? "Dispensing..." : "Faucet!"}
                    </button>
                    <span>Optional</span>
                  </span>
                </div>
                {proofError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded relative mt-4 ">
                    <strong className="font-bold">{proofError}</strong>
                  </div>
                )}
                <div className="flex justify-end">
                  {loading ? (
                    <div className="flex items-center">
                      <FaCircleNotch className="animate-spin text-4xl mr-4" />
                      <span className="italic">{statusText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 mr-4"
                        type="submit"
                      >
                        Collected!
                      </button>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 mr-4"
                        onClick={closeProofModal}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};
