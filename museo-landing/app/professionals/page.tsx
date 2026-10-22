import type { Metadata } from "next";
import { AudiencePage } from "@/components/AudiencePage";

export const metadata: Metadata = { title: "For Professionals", description: "Digital strategy and experience solutions for museum professionals." };
const services = [
  ["Digital strategy consulting","Build an actionable roadmap aligned with your mission, audiences, operations, and goals."],
  ["Virtual exhibitions","Extend collections globally through high-resolution imaging, virtual tours, and interactive media."],
  ["Interactive displays","Enhance exhibitions with touch, gesture, augmented reality, and accessible interpretation."],
  ["Collection digitization","Preserve artifacts, artworks, and documents while making them discoverable."],
  ["Digital archiving","Protect multimedia assets through secure systems built for long-term access and integrity."],
  ["Staff training","Equip teams to create content, manage platforms, and operate visitor systems."],
  ["LMS and SCORM content","Deliver interoperable learning pathways for staff, educators, and visitors."],
  ["Digital docents","Use responsible AI to answer questions, guide tours, and make knowledge accessible."],
  ["Visitor feedback and analytics","Understand behavior, preferences, and engagement through ethical insight tools."],
  ["Education and outreach","Create curriculum-ready modules, webinars, and workshops."],
  ["Membership and fundraising","Develop meaningful loyalty, donor, and membership experiences."],
  ["Accessibility and sustainability","Improve inclusive access with efficient infrastructure and responsible operations."],
].map(([title,description])=>({title,description}));

export default function ProfessionalsPage(){return <AudiencePage audience="For museum professionals" title={<>Build what culture<br/>needs next.</>} intro="We empower museums with practical strategy, resilient collection systems, accessible experiences, and sustainable tools." image="https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=2200&q=88" imageAlt="Classical paintings inside a museum" sectionTitle="Strengthen collections, teams, and visitor relationships." sectionIntro="We align technology with institutional goals, then build the systems and capabilities needed for lasting value." services={services} featureTitle="Give your team the tools to keep evolving." featureCopy="Our museum-specific learning systems support training, knowledge sharing, compliance, and professional growth." footerHeading="Let’s shape your museum’s digital future."/>}
