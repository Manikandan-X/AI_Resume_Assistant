import { useState } from "react";

const SkillsInput = ({ skills, onChange }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-2.5 py-1 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-500 hover:text-blue-800 font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder="Type a skill and press Enter"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SkillsInput;