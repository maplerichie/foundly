import React from "react";
import { useState } from "react";
import { Layout, Card } from "../components";
import { publicFound } from "../helpers/polybase";
import moment from "moment";
import { Item } from "../interface";
import categories from "../data/category.json";

interface Props {
  items: Item[];
  locations: string[];
}
const FoundsPage = ({ items, locations }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(0);
  const [itemList, setItems] = useState<Item[]>(items);
  const [locationList, setLocations] = useState<string[]>(locations);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };

  const handleDateRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDateRange(event.target.value);
  };

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocation(event.target.value);
  };

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let status = parseInt(event.target.value);
    setStatus(status);
    const { data } = await publicFound.where("status", "==", status).get();
    let items = [];
    let locations = [];
    for (let i = 0; i < data.length; i++) {
      items.push(data[i].data);
      locations.push(data[i].data.location);
    }
    locations = [...new Set(locations)];
    setItems(items);
    setLocations(locations);
  };

  const getItems = async () => {};

  return (
    <Layout>
      <div className="flex flex-row">
        <div className="min-w-fit w-fit p-4">
          <h2 className="text-lg font-semibold mb-2">Filter</h2>
          <div className="mb-4">
            <label className="block mb-2">Category:</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.trim()} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Date Range:</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={dateRange}
              onChange={handleDateRangeChange}
            >
              <option value="">All Dates</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Location:</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={location}
              onChange={handleLocationChange}
            >
              <option value="">All Locations</option>
              {locationList.map((location) => (
                <option key={location.trim()} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Status:</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={status}
              onChange={handleStatusChange}
            >
              <option key={0} value="0">
                Found
              </option>
              <option key={1} value="1">
                Matched
              </option>
              <option key={2} value="2">
                Returned
              </option>
              <option key={3} value="3">
                Canceled
              </option>
            </select>
          </div>
        </div>
        <div className="w-2/3 min-w-fit p-4">
          <div className="mb-4">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          {itemList.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {itemList.map((item: any) => (
                <Card key={item.id} item={item} type={"found"} />
              ))}
            </div>
          ) : (
            <div className="w-80 h-72 inset-0 flex items-center justify-center">
              <span className="text-gray-400">
                {status === 0
                  ? "Nobody discovered anything 🕵️"
                  : status === 1
                  ? "No one lost anything 😋"
                  : status === 2
                  ? "No one retrieve his/her lost 💔"
                  : "No records ... 🤔"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

FoundsPage.getInitialProps = async ({}) => {
  const { data } = await publicFound.where("status", "==", 0).get();
  let items = [];
  let locations = [];
  for (let i = 0; i < data.length; i++) {
    items.push(data[i].data);
    locations.push(data[i].data.location);
  }
  locations = [...new Set(locations)];
  return { items: items, locations: locations };
};

export default FoundsPage;
