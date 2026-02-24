import React from 'react';
import Navbar from '../components/Navbar';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex flex-col justify-center h-full">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-blue-600 w-6 h-6 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">Address</h3>
                                            <p className="text-gray-600">Bannari Amman Institute of Technology, <br />Sathyamangalam, Erode, <br />India - 638401</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone className="text-blue-600 w-6 h-6" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">Helpline</h3>
                                            <p className="text-gray-600">04295 226 000</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail className="text-blue-600 w-6 h-6" />
                                        <div>
                                            <h3 className="font-bold text-gray-800">Email</h3>
                                            <p className="text-gray-600">helpdesk@bitsathy.ac.in</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.577237060372!2d77.27366577481744!3d11.517303088680785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9215d6d1b28f9%3A0xf48946a7dfcfeb1a!2sBannari%20Amman%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1708061234567!5m2!1sen!2sin"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Contact;
