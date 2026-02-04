import { MdLocationOn, MdFacebook, MdEmail } from "react-icons/md";

export default function Contact() {
    return (
        <section
            id="contact"
            className="min-h-screen bg-black text-white flex items-center"
        >
            <div className="max-w-7xl mx-auto px-6 py-20 w-full">

                {/* Title */}
                <h2 className="text-3xl md:text-5xl font-serif mb-16 md:mb-24 text-center md:text-left">
                    REACH OUT <br /> TO ME !!
                </h2>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16 text-gray-400 text-sm mb-10 md:ml-10">

                    {/* Address */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <MdLocationOn className="text-lg" />
                            ADDRESS
                        </h4>
                        <p className="uppercase leading-relaxed">
                            Purbichauki Rural Municipality<br />
                            Khirsain-01<br />
                            Phulaut, Doti, Nepal
                        </p>
                    </div>

                    {/* Email */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <MdEmail className="text-lg" />
                            EMAIL
                        </h4>
                        <p className="break-words">sirmalbharat99@gmail.com</p>
                    </div>

                    {/* Facebook */}

                    <div className="text-center sm:text-left">
                        <h4 className="text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <MdFacebook className="text-lg" />
                            FACEBOOK
                        </h4>
                        <a
                            href="https://www.facebook.com/er.bharat.sirmal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 text-white hover:opacity-80 transition"
                        >
                            Bharat Sirmal
                        </a>
                    </div>


                </div>

                {/* Bottom CTA */}
                <div className="flex justify-center md:justify-end mt-16 md:mt-24">
                    <div className="flex items-center gap-3 cursor-pointer">
                        <span className="text-xl">↘</span>
                        <a
                            href="https://www.instagram.com/imbharatsirmal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 text-white hover:opacity-80 transition"
                        >
                            LET&apos;S COLLABORATE
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
