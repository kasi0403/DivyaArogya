import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientReport = () => {
  const [showDietForm, setShowDietForm] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(['']);
  const [mealData, setMealData] = useState({
    name: '',
    calories: '',
    nutritionalInfo: {
      protein: '',
      carbs: '',
      fat: ''
    }
  });
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMealData({
        ...mealData,
        [parent]: {
          ...mealData[parent],
          [child]: value
        }
      });
    } else {
      setMealData({
        ...mealData,
        [name]: value
      });
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    
    try {
      const response = await axios.post('http://localhost:5000/getdietplan', {
        ...mealData,
        ingredients: filteredIngredients
      });
      
      // Parse the result string to JSON
      let recipeData = response.data.result.generated_text;
      
      // Add closing brace if missing
      if (!recipeData.endsWith('}')) {
        recipeData += '}';
      }
      
      try {
        // Attempt to parse the JSON response
        const parsedRecipe = JSON.parse(recipeData);
        setGeneratedRecipe(parsedRecipe);
        toast.success('Diet plan generated successfully!');
      } catch (parseError) {
        console.error('Error parsing recipe JSON:', parseError);
        toast.error('Error parsing the generated recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast.error('Failed to generate diet plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setMealData({
      name: '',
      calories: '',
      nutritionalInfo: {
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setIngredients(['']);
    setGeneratedRecipe(null);
  };
  
  // Sample patient data
  const patient = {
    name: "John Smith",
    id: "P10042789",
    age: 45,
    gender: "Male",
    bloodType: "O+",
    doctor: "Dr. David",
    doctorRole: "Consulting Doctor"
  };
  
  // Sample BP data
  const bpData = [
    { date: '2025-01-15', value: 135 },
    { date: '2025-02-01', value: 138 },
    { date: '2025-02-15', value: 132 },
    { date: '2025-03-01', value: 137 },
    { date: '2025-03-10', value: 134 }
  ];
  
  // Sample Sugar data
  const sugarData = [
    { date: '2025-01-15', value: 118 },
    { date: '2025-02-01', value: 120 },
    { date: '2025-02-15', value: 116 },
    { date: '2025-03-01', value: 122 },
    { date: '2025-03-10', value: 118 }
  ];
  
  // Sample symptoms
  const symptoms = [
    "Persistent headache",
    "Elevated blood pressure",
    "Occasional dizziness",
    "Fatigue",
    "Shortness of breath after activity"
  ];
  
  // Sample risk data
  const riskPercentage = 35;
  
  const timeframes = ['Today', '7d', '2w', '1m', '3m', '6m', '1y'];
  
  return (
    <div className="bg-gray-50 min-h-screen">      
      <div className="mt-20 max-w-7xl mx-auto p-4">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <p className="text-gray-500">Patient Name</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.gender}</h2>
                <p className="text-gray-500">Gender</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.age}</h2>
                <p className="text-gray-500">Patient Age</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.bloodType}</h2>
                <p className="text-gray-500">Blood Type</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-600 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.doctor}</h2>
                <p className="text-gray-500">{patient.doctorRole}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-lg shadow-md flex">
            {timeframes.map(time => (
              <button
                key={time}
                onClick={() => setActiveTimeframe(time)}
                className={`px-4 py-2 ${activeTimeframe === time ? 'bg-blue-500 text-white' : 'text-gray-700'} rounded-lg`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* BP Levels Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">BP Levels</h2>
                <p className="text-gray-500">Recent 5 visits</p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 'dataMax + 20']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">2025-03-10</span>
                <span className="font-bold">134</span>
              </div>
            </div>
          </div>
          
          {/* Sugar Levels Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Sugar Levels</h2>
                <p className="text-gray-500">Recent 5 visits</p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sugarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 'dataMax + 20']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">2025-03-10</span>
                <span className="font-bold">118</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Precautions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Precautions</h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <ul className="list-disc pl-5 space-y-1">
              <li>Avoid strenuous physical activity for at least 2 weeks</li>
              <li>Medication should be taken after meals to avoid gastric irritation</li>
              <li>Monitor blood pressure twice daily and maintain a log</li>
              <li>Limit sodium intake to less than 2,300mg per day</li>
              <li>Report any chest pain or severe headache immediately</li>
            </ul>
          </div>
        </div>
        
        {/* Symptoms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Symptoms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {symptoms.map((symptom, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded">
                {symptom}
              </div>
            ))}
          </div>
        </div>
        
        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Assessment</h2>
          <div className="flex items-center mb-2">
            <div className="w-64 bg-gray-200 rounded-full h-5 mr-4">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
                style={{ width: `${riskPercentage}%` }}
              ></div>
            </div>
            <span className="font-bold">{riskPercentage}%</span>
          </div>
          <p className="text-sm text-gray-600">
            Based on current symptoms and medical history. Moderate risk level requires regular monitoring.
          </p>
        </div>
        
        {/* Doctor's Note */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Doctor's Note</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="mb-3">
              Patient presents with symptoms consistent with Stage 1 hypertension. Blood pressure readings have been consistently elevated over the past three visits (145/92, 150/95, 148/94). 
            </p>
            <p className="mb-3">
              Prescribed lisinopril 10mg once daily. Patient should begin lifestyle modifications including the DASH diet and regular moderate exercise once cleared. Recommend follow-up in 4 weeks to assess medication efficacy.
            </p>
            <p className="italic text-gray-600">
              - Dr. David, Consulting Doctor
            </p>
          </div>
        </div>
        
        {/* Diet Plan Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowDietForm(!showDietForm)} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Diet Plan
          </button>
        </div>
        
        {/* Diet Plan Form (conditionally rendered) */}
        {showDietForm && (
          <div className="flex flex-col items-center w-full pt-8 px-4">
          <div className="w-full max-w-3xl" style={{ background: 'rgba(0, 0, 0, 0.5)', color:'white'}}>
            <div className="p-8 rounded-lg shadow-md mb-8" style={{ background: 'rgba(0, 0, 0, 0.5)'}}>
              <h2 className="text-2xl mb-4 text-center">Diet Plan Generator</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block font-medium mb-1" htmlFor="name">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="E.g., Breakfast, Lunch, Dinner, or specific meal"
                    value={mealData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1" htmlFor="calories">
                    Target Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="E.g., 500"
                    value={mealData.calories}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Ingredients (Optional)
                  </label>
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-l-md"
                        placeholder="E.g., chicken, rice, broccoli"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-3 bg-red-500 text-white rounded-r-md"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                      >
                        −
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-4 py-1 bg-green-500 text-white rounded-md"
                    onClick={addIngredient}
                  >
                    + Add Ingredient
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Nutritional Requirements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-1" htmlFor="protein">
                        Protein (g)
                      </label>
                      <input
                        type="text"
                        id="protein"
                        name="nutritionalInfo.protein"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 30g"
                        value={mealData.nutritionalInfo.protein}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" htmlFor="carbs">
                        Carbs (g)
                      </label>
                      <input
                        type="text"
                        id="carbs"
                        name="nutritionalInfo.carbs"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 50g"
                        value={mealData.nutritionalInfo.carbs}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" htmlFor="fat">
                        Fat (g)
                      </label>
                      <input
                        type="text"
                        id="fat"
                        name="nutritionalInfo.fat"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 15g"
                        value={mealData.nutritionalInfo.fat}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Diet Plan'}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-black rounded-md hover:bg-gray-400"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
            
            {generatedRecipe && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-bold mb-4">{generatedRecipe.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Nutritional Information</h4>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p><span className="font-medium">Calories:</span> {generatedRecipe.calories}</p>
                      <p><span className="font-medium">Protein:</span> {generatedRecipe.nutritionalInfo.protein}</p>
                      <p><span className="font-medium">Carbs:</span> {generatedRecipe.nutritionalInfo.carbs}</p>
                      <p><span className="font-medium">Fat:</span> {generatedRecipe.nutritionalInfo.fat}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Ingredients</h4>
                    <ul className="list-disc pl-5">
                      {generatedRecipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ToastContainer />
        </div>
        )}
      </div>
    </div>
  );
};

export default PatientReport;