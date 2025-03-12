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
    name: "Jane Smith",
    id: "P10042789",
    age: 45,
    gender: "Female",
    bloodType: "O+"
  };
  
  // Sample BP data
  const bpData = [
    { date: '2025-01-15', value: 135 },
    { date: '2025-02-01', value: 138 },
    { date: '2025-02-15', value: 132 },
    { date: '2025-03-01', value: 137 },
    { date: '2025-03-10', value: 134 },
    { date: '2025-03-12', value: 120 }
  ];
  
  // Sample Sugar data
  const sugarData = [
    { date: '2025-01-15', value: 118 },
    { date: '2025-02-01', value: 120 },
    { date: '2025-02-15', value: 116 },
    { date: '2025-03-01', value: 122 },
    { date: '2025-03-10', value: 118 },
    { date: '2025-03-12', value: 200 }
  ];
  
  // Sample symptoms
  const symptoms = [
    "Fatigue and weakness",
    "Abdominal discomfort or swelling",
    "Loss of appetite",
    "Pale skin due to anemia",
    "Mild shortness of breath",
    "Occasional dizziness",
    "Easy bruising or prolonged bleeding"
  ];
  
  
  // Sample risk data
  const riskPercentage = 35;
  
  const timeframes = ['Today', '7d', '2w', '1m', '3m', '6m', '1y'];

  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    ingredients: '',
    nutritionalInfo: {
      protein: '',
      carbs: '',
      fat: ''
    }
  });
  
  const [recipe, setRecipe] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const [loadingD, setLoadingD] = useState(false);
  const [error, setError] = useState('');

  const handleChangeDiet = (e) => {
    const { name, value } = e.target;
    if (name === 'protein' || name === 'carbs' || name === 'fat') {
      setFormData({
        ...formData,
        nutritionalInfo: {
          ...formData.nutritionalInfo,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Function to extract JSON from text that may contain other content
  const extractJsonFromText = (text) => {
    try {
      // Find the start of the JSON object
      const jsonStartIndex = text.indexOf('{');
      if (jsonStartIndex === -1) return null;
      
      // Extract from the start of the JSON to the end of the response
      let jsonText = text.substring(jsonStartIndex);
      
      // Count braces to find the actual end of the JSON
      let openBraces = 0;
      let jsonEndIndex = 0;
      
      for (let i = 0; i < jsonText.length; i++) {
        if (jsonText[i] === '{') openBraces++;
        if (jsonText[i] === '}') openBraces--;
        
        // When we've found a balanced JSON structure, cut off there
        if (openBraces === 0 && i > 0) {
          jsonEndIndex = i;
          break;
        }
      }
      
      // If we found a valid JSON structure
      if (jsonEndIndex > 0) {
        // Extract JSON part and the rest
        const jsonPart = jsonText.substring(0, jsonEndIndex + 1);
        const directionsPart = jsonText.substring(jsonEndIndex + 1).trim();
        
        // Parse the JSON part
        const parsedJson = JSON.parse(jsonPart);
        
        // Add directions if they exist
        if (directionsPart) {
          parsedJson.directions = directionsPart;
        }
        
        return parsedJson;
      }
      
      // If no valid end is found, try to parse the whole thing
      return JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to extract JSON:", e);
      return null;
    }
  };

  const handleDietSubmit = async (e) => {
    e.preventDefault();
    setLoadingD(true);
    setError('');
    setRecipe(null);
    setRawResponse(null);
    
    try {
      // Process ingredients from comma-separated string to array
      const processedData = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(item => item.trim())
      };
      
      const response = await fetch('http://localhost:4000/getdietplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }

      const data = await response.json();
      
      // Store the raw response
      setRawResponse(data.result);
      
      // Try to extract JSON if the response is a string containing JSON
      if (typeof data.result === 'string') {
        const extractedJson = extractJsonFromText(data.result);
        if (extractedJson) {
          setRecipe(extractedJson);
        }
      } else if (typeof data.result === 'object') {
        // If already an object, use it directly
        setRecipe(data.result);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingD(false);
    }
  };

  // Function to format the cooking directions
  const formatDirections = (directions) => {
    if (!directions) return null;
    
    // Check if directions is a string
    if (typeof directions === 'string') {
      // Try to identify if it's already numbered
      if (directions.includes('1.') || directions.includes('1)') || 
          directions.includes('Step 1') || directions.toLowerCase().includes('instructions:')) {
        // It's already formatted, just display it with line breaks
        return (
          <div className="whitespace-pre-line">
            {directions}
          </div>
        );
      } else {
        // It's not formatted, split by periods or new lines
        const steps = directions.split(/\.\s+|\n+/).filter(step => step.trim().length > 0);
        return (
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((step, index) => (
              <li key={index}>{step.trim()}{!step.trim().endsWith('.') ? '.' : ''}</li>
            ))}
          </ol>
        );
      }
    }
    
    // If it's already an array
    if (Array.isArray(directions)) {
      return (
        <ol className="list-decimal list-inside space-y-2">
          {directions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      );
    }
    
    return null;
  };

  // Function to clean and format the recipe output
  const formatRecipe = (recipeData) => {
    if (!recipeData) return null;
  }
  
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
              <li>Avoid strenuous physical activity for at least 4 weeks (increased from 2 weeks due to liver condition).</li>
              <li>Medication should be taken with meals to avoid gastric irritation and prevent further liver stress.</li>
              <li>Monitor blood pressure and liver enzyme levels regularly.</li>
              <li>Limit sodium intake to less than 2,000 mg per day (more strict due to mild ascites)</li>
              <li>Report any abdominal pain, swelling, or yellowing of the skin immediately.</li>
            </ul>
          </div>
        </div>
        
        {/* Symptoms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Consequences</h2>
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
                style={{ width: `70%` }}
              ></div>
            </div>
            <span className="font-bold">70%</span>
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
              Doctor hasn't uploaded any notes yet! 
            </p>
            {/* <p className="mb-3">
              Prescribed lisinopril 10mg once daily. Patient should begin lifestyle modifications including the DASH diet and regular moderate exercise once cleared. Recommend follow-up in 4 weeks to assess medication efficacy.
            </p> */}
            {/* <p className="italic text-gray-600">
              - Dr. David, Consulting Doctor
            </p> */}
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
          <div className="bg-white rounded-lg p-6 mt-4">
        <h3 className="text-xl font-bold mb-3">{recipeData.name}</h3>
        
        <div className="mb-4">
          <p className="font-semibold">Calories: {recipeData.calories}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside">
            {recipeData.ingredients && recipeData.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Nutritional Information:</h4>
          {recipeData.nutritionalInfo && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center">
                <span className="block font-medium">Protein</span>
                <span>{recipeData.nutritionalInfo.protein}{typeof recipeData.nutritionalInfo.protein === 'number' ? 'g' : ''}</span>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <span className="block font-medium">Carbs</span>
                <span>{recipeData.nutritionalInfo.carbs}{typeof recipeData.nutritionalInfo.carbs === 'number' ? 'g' : ''}</span>
              </div>
              <div className="bg-yellow-50 p-2 rounded text-center">
                <span className="block font-medium">Fat</span>
                <span>{recipeData.nutritionalInfo.fat}{typeof recipeData.nutritionalInfo.fat === 'number' ? 'g' : ''}</span>
              </div>
            </div>
          )}
        </div>
        
        {recipeData.directions && (
          <div>
            <h4 className="font-semibold mb-2">Cooking Directions:</h4>
            <div className="bg-gray-50 p-4 rounded">
              {formatDirections(recipeData.directions)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Diet Plan Generator</h1>
        <p className="text-gray-600">Generate custom recipes based on your nutritional needs</p>
      </div>
      
      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recipe Parameters</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-gray-700 mb-2">Meal Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g., Chicken Salad"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="calories" className="block font-medium text-gray-700 mb-2">Target Calories</label>
              <input 
                type="number" 
                id="calories" 
                name="calories" 
                value={formData.calories} 
                onChange={handleChange}
                placeholder="e.g., 500"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="ingredients" className="block font-medium text-gray-700 mb-2">Ingredients (comma separated)</label>
              <textarea 
                id="ingredients" 
                name="ingredients" 
                value={formData.ingredients} 
                onChange={handleChange}
                placeholder="e.g., chicken, avocado, lettuce"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 resize-y"
                required
              />
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Nutritional Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="protein" className="block font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input 
                    type="text" 
                    id="protein" 
                    name="protein" 
                    value={formData.nutritionalInfo.protein} 
                    onChange={handleChange}
                    placeholder="e.g., 30g"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="carbs" className="block font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input 
                    type="text" 
                    id="carbs" 
                    name="carbs" 
                    value={formData.nutritionalInfo.carbs} 
                    onChange={handleChange}
                    placeholder="e.g., 40g"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="fat" className="block font-medium text-gray-700 mb-2">Fat (g)</label>
                  <input 
                    type="text" 
                    id="fat" 
                    name="fat" 
                    value={formData.nutritionalInfo.fat} 
                    onChange={handleChange}
                    placeholder="e.g., 15g"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating Recipe...' : 'Generate Recipe'}
            </button>
          </form>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Generating your recipe...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Display formatted recipe if available */}
        {recipe && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Recipe</h2>
            {formatRecipe(recipe)}
          </div>
        )}
        
        {/* Display raw response for debugging */}
        {rawResponse && !recipe && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">API Response (Raw)</h2>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(rawResponse, null, 2)}</pre>
            </div>
            <div className="mt-4">
              <p className="text-amber-600">
                The API returned a response that couldn't be fully parsed. The raw response is shown above.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
        )}
    </div>
  );
};

export default PatientReport;