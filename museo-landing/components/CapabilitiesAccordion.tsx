"use client";

import { useState } from "react";

const capabilities = [
  {
    number: "01",
    title: "Digitize & preserve",
    description: "Protect collections while opening them to new audiences through high-resolution digitization, structured archives, cloud repositories, and future-ready cataloguing.",
    services: ["Collection digitization", "Digital archiving", "AI-assisted cataloguing", "Conservation reporting"],
  },
  {
    number: "02",
    title: "Engage & educate",
    description: "Turn visits into active learning journeys with virtual exhibitions, interactive displays, learning platforms, AR layers, and story-led experiences.",
    services: ["Virtual tours", "AR & VR exhibits", "Learning management systems", "Gamified learning"],
  },
  {
    number: "03",
    title: "Include every visitor",
    description: "Design museum experiences around real human needs with accessible routes, translation, audio description, flexible media, and inclusive interpretation.",
    services: ["Accessibility planning", "Language services", "Personalized guides", "Family-friendly journeys"],
  },
  {
    number: "04",
    title: "Operate & grow",
    description: "Give museum teams the strategy, data, and skills to sustain meaningful digital transformation long after launch.",
    services: ["Digital strategy", "Visitor analytics", "Staff training", "Membership experiences"],
  },
];

export function CapabilitiesAccordion() {
  const [openItems, setOpenItems] = useState(() => new Set([0]));

  const toggle = (index: number) => {
    setOpenItems(current => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return <div className="service-list">
    {capabilities.map((capability, index) => {
      const open = openItems.has(index);
      const panelId = `capability-panel-${index}`;
      return <article className={`service-item${open ? " is-open" : ""}`} key={capability.number}>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => toggle(index)}>
          <span className="service-no">{capability.number}</span>
          <span>{capability.title}</span>
          <span className="service-icon" aria-hidden="true">{open ? "—" : "+"}</span>
        </button>
        <div className="service-panel" id={panelId} hidden={!open}>
          <p>{capability.description}</p>
          <ul>{capability.services.map(service => <li key={service}>{service}</li>)}</ul>
        </div>
      </article>;
    })}
  </div>;
}
