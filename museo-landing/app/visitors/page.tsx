import type { Metadata } from "next";
import { AudiencePage } from "@/components/AudiencePage";

export const metadata: Metadata = { title: "For Visitors", description: "Personalized, accessible, and immersive museum experiences for visitors." };
const services = [
  ["Virtual museum tours","Explore museum spaces and interact with exhibitions from anywhere through immersive virtual tours."],
  ["Educational gaming","Discover collections through story-driven challenges that make learning active and memorable."],
  ["Personalized visitor guides","Receive tailored information, routes, and recommendations based on your interests and time."],
  ["Artwork augmentation","Reveal artist stories, historical context, and creative techniques through accessible AR layers."],
  ["Digital learning hubs","Join workshops and interactive modules that complement physical exhibitions."],
  ["AR and VR learning","Travel across times and places through augmented trails and immersive learning experiences."],
  ["Live talks and Q&A","Connect with curators and experts through interactive lectures, polls, and questions."],
  ["Language and cultural access","Use real-time translation and cultural context to understand collections more deeply."],
  ["Family and accessible routes","Follow comfortable, inclusive itineraries for families and visitors with disabilities."],
  ["360° experiences","Experience panoramic exhibitions and performances through immersive video."],
  ["Tickets and visit planning","Manage tickets, event notifications, food orders, and practical details in one place."],
  ["Creative membership","Access workshops, art recommendations, curated content, and special events."],
].map(([title,description])=>({title,description}));

export default function VisitorsPage(){return <AudiencePage audience="For museum visitors" title={<>Explore culture<br/>your way.</>} intro="Museoedu enriches in-person and virtual museum visits with personalized, immersive, and accessible experiences." image="https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=2200&q=88" imageAlt="Visitors exploring a museum gallery" sectionTitle="From first discovery to deeper understanding." sectionIntro="Our tools help every visitor find context, participate, and connect—at home or inside the museum." services={services} featureTitle="Turn every museum visit into an educational journey." featureCopy="Our visitor learning hub connects curated content, events, progress, and recommendations in one accessible experience." footerHeading="Ready to experience culture differently?"/>}
