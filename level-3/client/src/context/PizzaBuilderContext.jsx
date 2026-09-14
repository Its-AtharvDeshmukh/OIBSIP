import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const PizzaBuilderContext = createContext();

const FALLBACK_INGREDIENTS = {
  bases: [
    { _id: 'b1', name: 'Classic Hand Tossed', category: 'Base', price: 149, stock: 50 },
    { _id: 'b2', name: 'Thin Crust', category: 'Base', price: 129, stock: 40 },
    { _id: 'b3', name: 'Cheese Burst Crust', category: 'Base', price: 199, stock: 25 },
    { _id: 'b4', name: 'Whole Wheat Crust', category: 'Base', price: 159, stock: 30 },
    { _id: 'b5', name: 'Gluten-Free Herb Crust', category: 'Base', price: 179, stock: 20 }
  ],
  sauces: [
    { _id: 's1', name: 'Classic Marinara', category: 'Sauce', price: 49, stock: 100 },
    { _id: 's2', name: 'Spicy Red Pepper', category: 'Sauce', price: 59, stock: 80 },
    { _id: 's3', name: 'Creamy Garlic Alfredo', category: 'Sauce', price: 69, stock: 60 },
    { _id: 's4', name: 'Smoky Chipotle Barbeque', category: 'Sauce', price: 59, stock: 70 },
    { _id: 's5', name: 'Zesty Basil Pesto', category: 'Sauce', price: 79, stock: 40 }
  ],
  cheeses: [
    { _id: 'c1', name: 'Fresh Mozzarella', category: 'Cheese', price: 89, stock: 90 },
    { _id: 'c2', name: 'Sharp Cheddar', category: 'Cheese', price: 99, stock: 50 },
    { _id: 'c3', name: 'Gouda Blend', category: 'Cheese', price: 119, stock: 35 },
    { _id: 'c4', name: 'Plant-Based Vegan Cheese', category: 'Cheese', price: 129, stock: 30 }
  ],
  veggies: [
    { _id: 'v1', name: 'Crisp Bell Peppers', category: 'Veggie', price: 39, stock: 100 },
    { _id: 'v2', name: 'Sliced Button Mushrooms', category: 'Veggie', price: 49, stock: 75 },
    { _id: 'v3', name: 'Red Onions', category: 'Veggie', price: 29, stock: 120 },
    { _id: 'v4', name: 'Spanish Black Olives', category: 'Veggie', price: 49, stock: 60 },
    { _id: 'v5', name: 'Golden Sweet Corn', category: 'Veggie', price: 39, stock: 85 },
    { _id: 'v6', name: 'Pickled Jalapeños', category: 'Veggie', price: 39, stock: 90 },
    { _id: 'v7', name: 'Baby Spinach & Cherry Tomatoes', category: 'Veggie', price: 59, stock: 50 }
  ]
};

export const PizzaBuilderProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredients, setIngredients] = useState(FALLBACK_INGREDIENTS);
  const [loading, setLoading] = useState(true);

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const { data } = await API.get('/inventory');
        // Backend returns: { success: true, data: { bases: [...], sauces: [...], cheeses: [...], veggies: [...] } }
        const payload = data.data || data;
        
        if (payload && (payload.bases || payload.sauces)) {
          setIngredients({
            bases: payload.bases?.length ? payload.bases : FALLBACK_INGREDIENTS.bases,
            sauces: payload.sauces?.length ? payload.sauces : FALLBACK_INGREDIENTS.sauces,
            cheeses: payload.cheeses?.length ? payload.cheeses : FALLBACK_INGREDIENTS.cheeses,
            veggies: payload.veggies?.length ? payload.veggies : FALLBACK_INGREDIENTS.veggies,
          });
        }
      } catch (error) {
        console.warn('Inventory API unreachable. Using fallback ingredient dataset.');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Pre-select defaults once loaded
  useEffect(() => {
    if (!loading && ingredients.bases.length > 0 && !selectedBase) {
      setSelectedBase(ingredients.bases[0]);
    }
    if (!loading && ingredients.sauces.length > 0 && !selectedSauce) {
      setSelectedSauce(ingredients.sauces[0]);
    }
    if (!loading && ingredients.cheeses.length > 0 && !selectedCheese) {
      setSelectedCheese(ingredients.cheeses[0]);
    }
  }, [loading, ingredients]);

  const toggleVeggie = (veggie) => {
    if (selectedVeggies.some((v) => v._id === veggie._id)) {
      setSelectedVeggies(selectedVeggies.filter((v) => v._id !== veggie._id));
    } else {
      setSelectedVeggies([...selectedVeggies, veggie]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;
    selectedVeggies.forEach((v) => { total += v.price; });
    return total;
  };

  const resetCustomPizza = () => {
    setSelectedBase(ingredients.bases[0] || null);
    setSelectedSauce(ingredients.sauces[0] || null);
    setSelectedCheese(ingredients.cheeses[0] || null);
    setSelectedVeggies([]);
    setCurrentStep(1);
  };

  return (
    <PizzaBuilderContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        ingredients,
        loading,
        selectedBase,
        setSelectedBase,
        selectedSauce,
        setSelectedSauce,
        selectedCheese,
        setSelectedCheese,
        selectedVeggies,
        setSelectedVeggies,
        toggleVeggie,
        totalPrice: calculateTotal(),
        resetCustomPizza
      }}
    >
      {children}
    </PizzaBuilderContext.Provider>
  );
};

export const usePizzaBuilder = () => useContext(PizzaBuilderContext);