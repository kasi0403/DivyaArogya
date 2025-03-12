import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Admin = () => {
  const [registerType, setRegisterType] = useState('patient');
  const [patientData, setPatientData] = useState({ 
    name: '', 
    age: '', 
    gender: '',
    bloodGroup: '',
    medicalHistory: ''
  });
  const [careData, setCareData] = useState({ 
    name: '', 
    age: '', 
    gender: '',
    username: '', 
    password: '' 
  });
  const [doctorData, setDoctorData] = useState({
    name: '',
    gender: '',
    specialization: '',
    username: '',
    password: ''
  });
  const [signedUp, setSignedUp] = useState(false);
  const [errorSigningUp, setErrorSigningUp] = useState('');
  const [userId, setUserId] = useState('');

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, bloodGroup, medicalHistory } = patientData;
    try {
      const response = await fetch('http://localhost:5000/api/addpatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, gender, bloodGroup, medicalHistory }),
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success('Patient added successfully!');
        setPatientData({ name: '', age: '', gender: '', bloodGroup: '', medicalHistory: '' });
      } else {
        toast.error(`Failed to add patient: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Error adding patient. Please try again.');
    }
  };

  const handleCareSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, age, gender, username, password } = careData;
      const resp = await axios.post('http://localhost:5000/api/signup', { 
        username, 
        password,
        name,
        age,
        gender
      });
      if (resp.data) {
        setUserId(resp.data.userId);
        setSignedUp(true);
        setErrorSigningUp('');
        toast.success('Caregiver added successfully!');
        
        setTimeout(() => {
          setCareData({ name: '', age: '', gender: '', username: '', password: '' });
          setSignedUp(false);
        }, 2000);
        
      } 
      else if(resp.status==500)
      {
        toast.error('Error while adding caregiver');
      }
      else {
        setSignedUp(false);
        setErrorSigningUp("Error while adding caregiver");
        toast.error('Error while adding caregiver');
      }
    } catch (error) {
      console.log("Error while adding caregiver", error);
      setSignedUp(false);
      setErrorSigningUp("Error while adding caregiver");
     
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, gender, specialization, username, password } = doctorData;
      const resp = await axios.post('http://localhost:5000/api/adddoctor', { 
        name, 
        gender, 
        specialization,
        username,
        password
      });
      if (resp.data) {
        toast.success('Doctor added successfully!');
        setDoctorData({ name: '', gender: '', specialization: '', username: '', password: '' });
      } 
      else {
        toast.error('Error while adding doctor');
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Error adding doctor. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (registerType === 'patient') {
      setPatientData({ ...patientData, [name]: value });
    } else if (registerType === 'care') {
      setCareData({ ...careData, [name]: value });
    } else if (registerType === 'doctor') {
      setDoctorData({ ...doctorData, [name]: value });
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center relative overflow-hidden">
      <div className="relative z-2">
        <div className=" p-6 rounded-lg shadow-md" style={{ background: 'rgba(0, 0, 0,0.5)'}}>
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            {registerType === 'patient' 
              ? 'Patient Registration' 
              : registerType === 'care' 
                ? 'Caregiver Registration' 
                : 'Doctor Registration'}
          </h2>
          <div className="flex justify-center mb-4 flex-wrap">
            <button
              className={`font-medium mx-2 my-1 py-2 px-4 rounded ${registerType === 'patient' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setRegisterType('patient')}
            >
              Register Patient
            </button>
            <button
              className={`font-medium mx-2 my-1 py-2 px-4 rounded ${registerType === 'care' ? 'bg-black text-white' : 'bg-gray-300'}`}
              onClick={() => setRegisterType('care')}
            >
              Register Caregiver
            </button>
            <button
              className={`font-medium mx-2 my-1 py-2 px-4 rounded ${registerType === 'doctor' ? 'bg-black text-white' : 'bg-gray-300'}`}
              onClick={() => setRegisterType('doctor')}
            >
              Register Doctor
            </button>
          </div>

          {registerType === 'patient' ? (
            <form onSubmit={handlePatientSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter name"
                  value={patientData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter age"
                  value={patientData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="gender">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter gender"
                  value={patientData.gender}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="bloodGroup">
                  Blood Group
                </label>
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter blood group"
                  value={patientData.bloodGroup}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="medicalHistory">
                  Medical History
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter medical history (if any)"
                  value={patientData.medicalHistory}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
              >
                Add Patient
              </button>
            </form>
          ) : registerType === 'care' ? (
            <form onSubmit={handleCareSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter name"
                  value={careData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter age"
                  value={careData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="gender">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter gender"
                  value={careData.gender}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
              >
                Add Caregiver
              </button>
            </form>
          ) : (
            <form onSubmit={handleDoctorSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter name"
                  value={doctorData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="gender">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter gender"
                  value={doctorData.gender}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1" htmlFor="specialization">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter specialization"
                  value={doctorData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
              >
                Add Doctor
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;