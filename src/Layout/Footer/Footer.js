import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('token'); // افترض أن التوكن يُخزن في localStorage

  const Links = [
    {
      title: "Company",
      links: [
        {
          name: "Home",
          link: "/",
        },
        {
          name: "About Us",
          link: "/about-us",
        },
        {
          name: "Contact Us",
          link: "/contact-us",
        },
      ],
    },
    {
      title: "Top Movie Types",
      links: [
        {
          name: "Action",
          link: "#",
        },
        {
          name: "Romantic",
          link: "#",
        },
        {
          name: "Drama",
          link: "#",
        },
        {
          name: "History",
          link: "#",
        },
      ],
    },
    // إضافة قسم My Account فقط إذا كان المستخدم مسجل الدخول
    ...(isLoggedIn
      ? [
          {
            title: "My Account",
            links: [
              {
                name: "Dashboard",
                link: "/Dashboard",
              },
             
              {
                name: "Profile",
                link: "/profile",
              },
              {
                name: "Change Password",
                link: "/password",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="bg-dry">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 justify-between">
          {/* قائمة الروابط */}
          {Links.map((link, index) => (
            <div key={index} className="col-span-1 md:col-span-2 lg:col-span-3 pb-3.5 sm:pb-0">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                {link.title}
              </h3>
              <ul className="text-sm space-y-3">
                {link.links.map((text, index) => (
                  <li key={index}>
                    <Link
                      to={text.link}
                      className="text-border hover:text-beige3"
                      style={{ display: 'inline' }} // تقييد الرابط ليكون مرتبطًا فقط بالنص
                    >
                      {text.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Logo and Contact Information */}
          <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3 md:col-start-6 xl:col-start-10">
            <Link to="/">
              <img
                src="/images/logo1.png"
                alt="logo"
                className="w-3/4 object-contain h-20 inline-block" // تقييد الرابط ليكون مرتبطًا فقط بالصورة
              />
            </Link>
            <p className="leading-7 text-sm text-border mt-3">
              <span>Riyadh, Saudi Arabia. Kingdom Abdullah Street</span>
              <br />
              <span>Tell: +963 955 555 555</span>
              <br />
              <span>Email: cinemate@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;