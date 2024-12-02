import React from 'react';
import { 
    TwitterIcon, 
    LinkedinIcon, 
    InstagramIcon, 
    GithubIcon, 
    MailIcon 
} from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: <TwitterIcon className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />, href: "https://twitter.com/your_handle", name: "Twitter" },
        { icon: <LinkedinIcon className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />, href: "https://linkedin.com/in/your_profile", name: "LinkedIn" },
        { icon: <InstagramIcon className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />, href: "https://instagram.com/your_username", name: "Instagram" },
        { icon: <GithubIcon className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />, href: "https://github.com/your_username", name: "GitHub" },
        { icon: <MailIcon className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />, href: "mailto:contact@blogify.com", name: "Email" }
    ];

    const footerLinks = [
        { title: "Product", links: ["Features", "Pricing", "Blog"] },
        { title: "Company", links: ["About", "Careers", "Press"] },
        { title: "Resources", links: ["Support", "Documentation", "Guides"] }
    ];

    return (
        <footer id='contact' className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden py-12 h-[19rem]">
          
            
            {/* Floating decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-500/40 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl z-0"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10 grid md:grid-cols-3 gap-12 py-4">
                {/* Brand Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Blogify</h2>
                    <p className="text-gray-600 text-sm max-w-xs">
                        Empowering creators with the best platform to share their stories and insights.
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex space-x-4 pt-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group hover:bg-gray-100 p-2 rounded-full transition-all"
                                aria-label={link.name}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
                
                {/* Footer Links */}
                <div className="grid grid-cols-3 col-span-2 gap-8">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-gray-800 mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-600 hover:text-gray-900 text-sm transition-colors hover:translate-x-1 inline-block"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-gray-100 py-6 text-center relative z-10 bg-white/70 backdrop-blur-sm">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Blogify. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
