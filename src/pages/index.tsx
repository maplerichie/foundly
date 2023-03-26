import { Layout } from "../components/";
import Image from "next/image";
import Link from "next/link";

function Page() {
  return (
    <>
      <Layout>
        <section className="hero-section">
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-16 lg:py-32">
            <div className="text-center lg:text-left lg:w-1/2">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                A Better Way to Find Your Lost Items
              </h1>
              <p className="text-xl lg:text-2xl mb-8">
                Our platform makes it easy to report and search for lost items,
                ensuring that you can find what you've lost quickly and easily.
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="https://media.istockphoto.com/id/477273563/vector/lost-found-box.jpg?s=612x612&w=0&k=20&c=D63_IrCalWqRLpYCnBA5b5QTfhxwbSggkxLiw7vQGGs="
                alt="Hero Image"
                width={800}
                height={600}
              />
            </div>
          </div>
        </section>

        <section className="how-it-works-section  py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-center">
              How It Works
            </h2>
            <div className="flex flex-col sm:flex-row justify-around items-center">
              <div className="flex items-center mb-8 sm:mb-0">
                <div className="bg-white rounded-full p-4 mr-8">📝</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">Report Your Item</h3>
                  <p className="text-lg">
                    Quickly report your lost or found item on our platform.
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-8 sm:mb-0">
                <div className="bg-white rounded-full p-4 mr-8">🔍</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">
                    Search for Your Item
                  </h3>
                  <p className="text-lg">
                    Easily search for your lost item using our powerful search
                    tools.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-4 mr-8">🎁</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2">Reclaim Your Item</h3>
                  <p className="text-lg">
                    Once your item has been found, you'll receive a notification
                    and be able to reclaim it easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-items-section py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-center">
              Featured Items
            </h2>
            <div className="flex flex-wrap -mx-4">
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/featured-item-1.jpg"
                    alt="Featured Item 1"
                    width={800}
                    height={600}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">
                      Lost Backpack Found
                    </h3>
                    <p className="text-gray-600">
                      A lost backpack was found near the central station. If
                      it's yours, please contact us.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/featured-item-2.jpg"
                    alt="Featured Item 2"
                    width={800}
                    height={600}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">
                      Lost Wallet Found
                    </h3>
                    <p className="text-gray-600">
                      A lost wallet was found in the park. If it's yours, please
                      contact us.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src="/featured-item-3.jpg"
                    alt="Featured Item 3"
                    width={800}
                    height={600}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">Lost Phone Found</h3>
                    <p className="text-gray-600">
                      A lost phone was found at the mall. If it's yours, please
                      contact us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/search"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
              >
                View More Items
              </Link>
            </div>
          </div>
        </section>

        <section className="testimonials-section py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-center" />
            <div className="flex flex-wrap justify-center">
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
                  <div className="text-lg mb-8">
                    &ldquo;I lost my keys at the park and thought they were gone
                    forever. But thanks to this platform, I was able to find
                    them within hours!&rdquo;
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src="/testimonial-1.jpg"
                        alt="Testimonial 1"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-bold">Jane Doe</div>
                      <div className="text-gray-600">Los Angeles, CA</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
                  <div className="text-lg mb-8">
                    &ldquo;I found a lost dog on my way home from work, and was
                    able to quickly find its owner using this platform. It was a
                    great feeling to reunite them!&rdquo;
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src="/testimonial-2.jpg"
                        alt="Testimonial 2"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-bold">John Smith</div>
                      <div className="text-gray-600">New York, NY</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
                  <div className="text-lg mb-8">
                    &ldquo;I lost my wedding ring on my way to the airport, and
                    was devastated. But thanks to this platform, it was found
                    and returned to me within a week!&rdquo;
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src="/testimonial-3.jpg"
                        alt="Testimonial 3"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-bold">Sara Williams</div>
                      <div className="text-gray-600">Chicago, IL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-center">
              About Our Platform
            </h2>
            <p className="text-lg leading-8 mb-8">
              Our lost and found platform was created with the goal of making it
              easier for people to report and find lost items. We believe that
              everyone should be able to find what they've lost quickly and
              easily, without the stress and frustration that often comes with
              losing something important. That's why we've created a platform
              that is user-friendly, intuitive, and effective, allowing you to
              report lost items with just a few clicks and search for them with
              ease. Whether you've lost your keys, your phone, or even your pet,
              we're here to help you find it.
            </p>
            {/* <div className="flex justify-center">
              <Link
                href="/about"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Learn More About Us
              </Link>
            </div> */}
          </div>
        </section>

        {/* <section className="contact-section py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-center">
              Contact Us
            </h2>
            <div className="flex flex-wrap -mx-4">
              <div className="md:w-1/2 px-4 mb-8">
                <form className="bg-white rounded-lg shadow-lg p-8">
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="block text-gray-800 font-bold mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-400 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-gray-800 font-bold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-400 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-gray-800 font-bold mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-400 focus:outline-none focus:border-green-500"
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div className="md:w-1/2 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                  <p className="text-gray-600">
                    Have questions or feedback about our platform? We'd love to
                    hear from you! Get in touch using the contact form, or reach
                    out to us directly using the information below.
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500 rounded-full p-2 mr-4">
                        <Image
                          src="/location-icon.svg"
                          alt="Location Icon"
                          width={20}
                          height={20}
                          className="text-white"
                        />
                      </div>
                      <div>
                        <div className="font-bold">Address</div>
                        <div className="text-gray-600">
                          123 Main St, Suite 200
                          <br />
                          Los Angeles, CA 90001
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500 rounded-full p-2 mr-4">
                        <Image
                          src="/phone-icon.svg"
                          alt="Phone Icon"
                          width={20}
                          height={20}
                          className="text-white"
                        />
                      </div>
                      <div>
                        <div className="font-bold">Phone</div>
                        <div className="text-gray-600">555-555-5555</div>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500 rounded-full p-2 mr-4">
                        <Image
                          src="/email-icon.svg"
                          alt="Email Icon"
                          width={20}
                          height={20}
                          className="text-white"
                        />
                      </div>
                      <div>
                        <div className="font-bold">Email</div>
                        <div className="text-gray-600">info@lostfound.com</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-full p-2 mr-4">
                        <Image
                          src="/social-icon.svg"
                          alt="Social Icon"
                          width={20}
                          height={20}
                          className="text-white"
                        />
                      </div>
                      <div>
                        <div className="font-bold">Social Media</div>
                        <div className="text-gray-600">
                          Follow us on Twitter and Facebook for updates.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </Layout>
    </>
  );
}

export default Page;
