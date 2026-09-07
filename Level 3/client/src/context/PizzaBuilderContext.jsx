import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const PizzaBuilderContext = createContext();

export const PizzaBuilderProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredients, setIngredients] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    veggies: []
  });
  const [loading, setLoading] = useState(true);

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const { data } = await API.get('/inventory');
        setIngredients(data.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

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
    setSelectedBase(null);
    setSelectedSauce(null);
    setSelectedCheese(null);
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