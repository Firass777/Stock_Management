import { FaChartLine, FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, 
  FaMobileAlt, FaCloud, FaShieldAlt, FaStar } from 'react-icons/fa';

const Home = () => {
return (
<div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white">
{/* Hero Section */}
<section className="relative py-32 px-4">
 <div className="absolute inset-0 bg-black opacity-30"></div>
 <div className="container mx-auto relative z-10 text-center">
   <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
     <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
       StockMaster Pro
     </span>
   </h1>
   <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
     Revolutionizing inventory management with cutting-edge technology and intuitive design
   </p>
   <div className="flex flex-col sm:flex-row justify-center gap-4">
     <a
       href="/register"
       className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition duration-300 shadow-lg hover:shadow-xl"
     >
       Get Started Free
     </a>
     <a
       href="/demo"
       className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-700 transition duration-300"
     >
       Live Demo
     </a>
   </div>
 </div>
</section>

{/* Features Section */}
<section className="py-20 bg-white text-blue-900">
 <div className="container mx-auto px-4">
   <div className="text-center mb-16">
     <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
     <p className="text-xl text-blue-700 max-w-3xl mx-auto">
       Everything you need to manage your inventory efficiently
     </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
     {/* Feature 1 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaChartLine className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">Real-time Analytics</h3>
       <p className="text-blue-800">
         Get instant insights with our powerful dashboard and reporting tools
       </p>
     </div>

     {/* Feature 2 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaUserGraduate className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">User Management</h3>
       <p className="text-blue-800">
         Control access with role-based permissions for your entire team
       </p>
     </div>

     {/* Feature 3 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaClipboardCheck className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">Stock Tracking</h3>
       <p className="text-blue-800">
         Monitor inventory levels and get alerts for low stock
       </p>
     </div>

     {/* Feature 4 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaMobileAlt className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">Mobile Ready</h3>
       <p className="text-blue-800">
         Access your inventory from anywhere with our mobile-friendly interface
       </p>
     </div>

     {/* Feature 5 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaCloud className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">Cloud Based</h3>
       <p className="text-blue-800">
         Your data is securely stored and accessible from any device
       </p>
     </div>

     {/* Feature 6 */}
     <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
       <div className="text-blue-600 mb-4">
         <FaShieldAlt className="text-4xl" />
       </div>
       <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
       <p className="text-blue-800">
         Military-grade encryption keeps your business data safe
       </p>
     </div>
   </div>
 </div>
</section>

{/* Testimonials */}
<section className="py-20 bg-blue-800">
 <div className="container mx-auto px-4">
   <div className="text-center mb-16">
     <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
     <p className="text-xl text-blue-200 max-w-3xl mx-auto">
       Join thousands of satisfied customers who transformed their inventory management
     </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
     {/* Testimonial 1 */}
     <div className="bg-blue-900 p-8 rounded-xl shadow-lg">
       <div className="flex mb-4">
         {[...Array(5)].map((_, i) => (
           <FaStar key={i} className="text-yellow-400" />
         ))}
       </div>
       <p className="text-lg mb-6">
         "StockMaster Pro reduced our inventory errors by 90% and saved us countless hours of manual tracking."
       </p>
       <div className="flex items-center">
         <div className="bg-blue-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
           <span className="font-bold">JD</span>
         </div>
         <div>
           <h4 className="font-bold">John Doe</h4>
           <p className="text-blue-300">Operations Manager, RetailCorp</p>
         </div>
       </div>
     </div>

     {/* Testimonial 2 */}
     <div className="bg-blue-900 p-8 rounded-xl shadow-lg">
       <div className="flex mb-4">
         {[...Array(5)].map((_, i) => (
           <FaStar key={i} className="text-yellow-400" />
         ))}
       </div>
       <p className="text-lg mb-6">
         "The mobile access has been a game-changer for our warehouse team. We can now update stock in real-time."
       </p>
       <div className="flex items-center">
         <div className="bg-blue-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
           <span className="font-bold">AS</span>
         </div>
         <div>
           <h4 className="font-bold">Amanda Smith</h4>
           <p className="text-blue-300">Warehouse Director, LogiTech</p>
         </div>
       </div>
     </div>

     {/* Testimonial 3 */}
     <div className="bg-blue-900 p-8 rounded-xl shadow-lg">
       <div className="flex mb-4">
         {[...Array(5)].map((_, i) => (
           <FaStar key={i} className="text-yellow-400" />
         ))}
       </div>
       <p className="text-lg mb-6">
         "Implementation was seamless and the customer support team was incredibly helpful throughout the process."
       </p>
       <div className="flex items-center">
         <div className="bg-blue-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
           <span className="font-bold">MR</span>
         </div>
         <div>
           <h4 className="font-bold">Michael Roberts</h4>
           <p className="text-blue-300">CEO, SupplyChain Solutions</p>
         </div>
       </div>
     </div>
   </div>
 </div>
</section>

{/* CTA Section */}
<section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
 <div className="container mx-auto px-4 text-center">
   <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Inventory Management?</h2>
   <p className="text-xl mb-8 max-w-3xl mx-auto">
     Join thousands of businesses that trust StockMaster Pro for their inventory needs
   </p>
   <div className="flex flex-col sm:flex-row justify-center gap-4">
     <a
       href="/register"
       className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition duration-300 shadow-lg hover:shadow-xl"
     >
       Start Free Trial
     </a>
     <a
       href="/contact"
       className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-700 transition duration-300"
     >
       Request Demo
     </a>
   </div>
 </div>
</section>
</div>
);
};

export default Home;