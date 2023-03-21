import { Layout } from "../components/";

function Page() {
  return (
    <>
      <Layout>
        <section>
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <h1 className="text-4xl font-bold text-center mb-8">
                Decentralized Lost & Found
              </h1>
              <p className="text-center mb-8">
                A platform to help you find your lost items and return found
                items to their rightful owners.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Page;
