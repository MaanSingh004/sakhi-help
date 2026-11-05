import React from "react";

export default function QuickExitDecoy({ onClose }) {
  return (
    <div className="decoy-mode">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", color: "#111" }}>NCERT General Science Reference Notes</h1>
            <p style={{ margin: "5px 0 0", color: "#555", fontSize: "14px" }}>Chapter 4: Carbon and Its Compounds · Class 10 Revision Sheet</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "11px",
              color: "#888",
              cursor: "pointer"
            }}
            title="Resume Platform"
          >
            [Close Study View]
          </button>
        </div>

        <section style={{ lineHeight: 1.7, fontSize: "15px", color: "#222" }}>
          <h3>1. Bonding in Carbon - The Covalent Bond</h3>
          <p>
            Carbon atoms have an atomic number of 6 with an electronic configuration of 2, 4. To achieve noble gas configuration, carbon cannot easily gain four electrons (due to nuclear charge issues) or lose four electrons (requires excessive ionization energy). Hence, carbon achieves stability exclusively by sharing valence electrons with other atoms.
          </p>

          <h3>2. Versatile Nature of Carbon</h3>
          <ul>
            <li><strong>Catenation:</strong> The unique ability of carbon to form bonds with other carbon atoms, creating extensive linear, branched, or cyclic molecular chains.</li>
            <li><strong>Tetravalency:</strong> With a valency of four, carbon is capable of bonding with four other atoms of carbon or monovalent elements like Hydrogen, Oxygen, and Chlorine.</li>
          </ul>

          <h3>3. Saturated vs Unsaturated Hydrocarbons</h3>
          <p>
            Compounds containing only single bonds between carbon atoms are called <em>alkanes</em> (saturated). Compounds having double or triple bonds are known as <em>alkenes</em> and <em>alkynes</em> (unsaturated) respectively.
          </p>
        </section>

        <div style={{ marginTop: "40px", paddingTop: "15px", borderTop: "1px solid #ddd", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              background: "#333",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "13px"
            }}
          >
            Return to Sakhi App
          </button>
        </div>
      </div>
    </div>
  );
}
