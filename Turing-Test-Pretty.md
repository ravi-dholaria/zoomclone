'''
// App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';
import RegistrationForm from './RegistrationForm';
import CandidateList from './CandidateList';

function App() {
  const [candidates, setCandidates] = useState([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage candidates={candidates} />} />
        <Route
          path="/candidate/registration"
          element={<RegistrationForm candidates={candidates} setCandidates={setCandidates} />}
        />
        <Route path="/candidate/list" element={<CandidateList candidates={candidates} />} />
      </Routes>
    </Router>
  );
}

export default App;

// Navbar.js
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
      <h1 data-testid="nav-heading">Job Portal</h1>
      <div>
        {location.pathname === '/candidate/registration' && (
          <>
            <Link to="/">
              <button data-testid="nav-home-btn" style={{ margin: '0 0.5rem' }}>Home</button>
            </Link>
            <Link to="/candidate/list">
              <button data-testid="nav-list-btn" style={{ margin: '0 0.5rem' }}>Candidate List</button>
            </Link>
          </>
        )}
        {location.pathname === '/candidate/list' && (
          <>
            <Link to="/">
              <button data-testid="nav-home-btn" style={{ margin: '0 0.5rem' }}>Home</button>
            </Link>
            <Link to="/candidate/registration">
              <button data-testid="nav-registration-btn" style={{ margin: '0 0.5rem' }}>Candidate Registration</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// HomePage.js
import { Link } from 'react-router-dom';

const HomePage = ({ candidates }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Link to="/candidate/list">
        <button data-testid="list-btn" style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
          Candidate List ({candidates.length})
        </button>
      </Link>
      <br />
      <Link to="/candidate/registration">
        <button data-testid="registration-btn" style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
          Candidate Registration
        </button>
      </Link>
    </div>
  );
};

export default HomePage;

// RegistrationForm.js
import { useState } from 'react';

const RegistrationForm = ({ candidates, setCandidates }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && skills.length < 5) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailExists = candidates.some(candidate => candidate.email === email);
    if (emailExists) {
      setAlertMessage('Email already exists');
      return;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      setAlertMessage('Name can only contain letters, numbers, and spaces');
      return;
    }
    const newCandidate = { name, email, role, skills };
    setCandidates([...candidates, newCandidate]);
    setName('');
    setEmail('');
    setRole('');
    setSkills([]);
    setSkillInput('');
    setAlertMessage('Candidate profile created');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setRole('');
    setSkills([]);
    setSkillInput('');
    setAlertMessage('');
  };

  const isSubmitDisabled = !name || !email || !role || skills.length === 0;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <form data-testid="registration-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="form-input-name"
            placeholder="Name"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="form-input-email"
            placeholder="Email"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            data-testid="form-input-role"
            placeholder="Role"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              data-testid="form-input-skill"
              placeholder="Add a skill"
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button
              data-testid="add-btn"
              onClick={handleAddSkill}
              disabled={!skillInput.trim() || skills.length >= 5}
              style={{ padding: '0.5rem 1rem' }}
            >
              Add Skill
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {skills.map((skill, index) => (
              <span
                key={index}
                data-testid="skill-tag"
                style={{ background: '#eee', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            data-testid="submit-btn"
            disabled={isSubmitDisabled}
            style={{ padding: '0.5rem 1rem', flex: 1 }}
          >
            Submit
          </button>
          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            style={{ padding: '0.5rem 1rem', flex: 1 }}
          >
            Reset
          </button>
        </div>
      </form>
      {alertMessage && (
        <div data-testid="alertMessage" style={{ marginTop: '1rem', color: alertMessage.includes('already') ? 'red' : 'green' }}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;

// CandidateList.js
import { useState } from 'react';

const CandidateList = ({ candidates }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = searchTerm
    ? candidates.filter(candidate =>
        candidate.skills.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : candidates;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search by skill"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button
          data-testid="search-all"
          onClick={() => setSearchTerm('')}
          style={{ padding: '0.5rem 1rem' }}
        >
          All
        </button>
      </div>
      <h2 data-testid="profiles-found-tag" style={{ marginBottom: '1rem' }}>
        {filteredCandidates.length} profiles found
      </h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredCandidates.map((candidate, index) => (
          <div
            key={index}
            data-testid="profile-card"
            style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{candidate.name}</h3>
            <p style={{ margin: '0 0 0.5rem 0' }}>{candidate.role}</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>{candidate.email}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{ background: '#eee', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
'''