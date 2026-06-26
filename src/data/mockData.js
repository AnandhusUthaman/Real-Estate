export const navItems = [
    { label: "Home", href: "#hero" },
    { label: "Properties", href: "#properties" },
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#footer" },
    { label: "Admin", href: "#admin", icon: "fa-shield-alt" }
];

export const initialProperties = [
    { id: 1, title: "Modern Family Villa", location: "Beverly Hills, CA", price: "$2,450,000", type: "sale", status: "For Sale", beds: 4, baths: 3, area: "3,200 sqft", img: "https://picsum.photos/400/300?random=1", featured: true },
    { id: 2, title: "Luxury Waterfront Apt", location: "Miami Beach, FL", price: "$4,800/mo", type: "rent", status: "For Rent", beds: 3, baths: 2, area: "1,800 sqft", img: "https://picsum.photos/400/300?random=2", featured: true },
    { id: 3, title: "Downtown Penthouse", location: "New York, NY", price: "$3,950,000", type: "sale", status: "For Sale", beds: 5, baths: 4, area: "4,100 sqft", img: "https://picsum.photos/400/300?random=3", featured: true },
    { id: 4, title: "Cozy Suburban Home", location: "Austin, TX", price: "$2,100/mo", type: "rent", status: "For Rent", beds: 3, baths: 2, area: "1,500 sqft", img: "https://picsum.photos/400/300?random=4", featured: true },
    { id: 5, title: "Hilltop Estate", location: "San Francisco, CA", price: "$5,800,000", type: "sale", status: "For Sale", beds: 6, baths: 5, area: "5,500 sqft", img: "https://picsum.photos/400/300?random=5", featured: false },
    { id: 6, title: "Chic Studio Loft", location: "Chicago, IL", price: "$1,800/mo", type: "rent", status: "For Rent", beds: 1, baths: 1, area: "750 sqft", img: "https://picsum.photos/400/300?random=6", featured: false },
    { id: 7, title: "Oceanview Paradise", location: "Malibu, CA", price: "$6,200,000", type: "sale", status: "For Sale", beds: 5, baths: 4, area: "4,800 sqft", img: "https://picsum.photos/400/300?random=7", featured: false },
    { id: 8, title: "Garden Apartment", location: "Seattle, WA", price: "$2,500/mo", type: "rent", status: "For Rent", beds: 2, baths: 1, area: "1,100 sqft", img: "https://picsum.photos/400/300?random=8", featured: false }
];

export const features = [
    { icon: "fa-map-marked-alt", color: "#2b7a78", title: "Prime Locations", desc: "Properties in the most desirable neighborhoods and up-and-coming areas." },
    { icon: "fa-handshake", color: "#fea82f", title: "Expert Guidance", desc: "Seasoned agents with deep local market knowledge at your service." },
    { icon: "fa-shield-alt", color: "#3b82f6", title: "Secure Process", desc: "End-to-end secure transactions with full legal and financial oversight." },
    { icon: "fa-chart-line", color: "#8b5cf6", title: "Smart Investment", desc: "Data-driven insights to help you make informed real estate decisions." }
];

export const stats = [
    { number: "1,200+", label: "Properties Listed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "500+", label: "Happy Families" },
    { number: "15+", label: "Years Experience" }
];

export const testimonials = [
    { name: "Sarah Johnson", role: "Homeowner", avatar: "https://i.pravatar.cc/80?img=1", text: "HomeVerse made our dream of owning a home a reality. Their team was incredibly supportive and knowledgeable throughout the entire process.", rating: 5 },
    { name: "Michael Chen", role: "Investor", avatar: "https://i.pravatar.cc/80?img=2", text: "I've worked with many real estate platforms, but HomeVerse stands out for their attention to detail and commitment to finding the best deals.", rating: 5 },
    { name: "Theresa Lee", role: "First-time Buyer", avatar: "https://i.pravatar.cc/80?img=3", text: "As a first-time buyer I was nervous, but the team guided me step by step. I found my perfect condo in just two weeks!", rating: 5 },
    { name: "David Kim", role: "Property Seller", avatar: "https://i.pravatar.cc/80?img=4", text: "Sold my house in record time at a great price. The marketing and negotiation skills of the HomeVerse team are outstanding.", rating: 5 },
    { name: "Emily Rodriguez", role: "Renter", avatar: "https://i.pravatar.cc/80?img=5", text: "Renting has never been easier. The platform is intuitive and the listings are always up-to-date with accurate details.", rating: 5 },
    { name: "James Wilson", role: "Real Estate Agent", avatar: "https://i.pravatar.cc/80?img=6", text: "Partnering with HomeVerse has been a game-changer for my business. Their tools and network are top-notch.", rating: 5 }
];

export const footerLinks1 = [
    { label: "About Us", href: "#" },
    { label: "Our Team", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press & Media", href: "#" },
    { label: "FAQ", href: "#" }
];

export const footerLinks2 = [
    { label: "Houses", href: "#" },
    { label: "Apartments", href: "#" },
    { label: "Villas", href: "#" },
    { label: "Condos", href: "#" },
    { label: "Commercial", href: "#" }
];

export const contactInfo = [
    { icon: "fa-map-marker-alt", text: "123 Main Street, Suite 100, Los Angeles, CA 90001" },
    { icon: "fa-phone-alt", text: "+1 (800) 123-4567" },
    { icon: "fa-envelope", text: "info@homeverse.com" },
    { icon: "fa-clock", text: "Mon-Fri: 9AM - 7PM, Sat: 10AM - 4PM" }
];

export const initialMessages = [
    { id: 1, from: "John Doe", email: "john@example.com", subject: "Interested in Villa", date: "2 hours ago", read: false },
    { id: 2, from: "Jane Smith", email: "jane@example.com", subject: "Financing Options", date: "5 hours ago", read: false },
    { id: 3, from: "Bob Wilson", email: "bob@example.com", subject: "Property Tour Request", date: "1 day ago", read: true },
    { id: 4, from: "Alice Brown", email: "alice@example.com", subject: "Investment Portfolio", date: "2 days ago", read: true }
];

export const initialUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "Homeowner", status: "active", joined: "Jan 12, 2025" },
    { id: 2, name: "Michael Chen", email: "michael@example.com", role: "Investor", status: "active", joined: "Dec 3, 2024" },
    { id: 3, name: "Theresa Lee", email: "theresa@example.com", role: "Buyer", status: "active", joined: "Feb 8, 2025" },
    { id: 4, name: "David Kim", email: "david@example.com", role: "Seller", status: "inactive", joined: "Nov 20, 2024" },
    { id: 5, name: "Emily Rodriguez", email: "emily@example.com", role: "Renter", status: "active", joined: "Mar 1, 2025" }
];
