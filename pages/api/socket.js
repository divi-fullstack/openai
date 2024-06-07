import { Server } from 'socket.io';

const faqData = {
  "welcomeMessage": "Hello! Welcome to the ChatRLT by Birla Estates. I’m here to help you understand those tricky terms in the real estate world. How can I assist you today?",
  "terms": {
    "1": {
      "name": "Floor Rise",
      "explanation": "Floor Rise refers to the additional cost per square foot for apartments located on higher floors. This cost is added because higher floors often provide better views and are less noisy. For example if an apartment on the 10th floor costs more per square foot than one on the 1st floor that's due to Floor Rise."
    },
    "2": {
      "name": "LTV (Loan to Value)",
      "explanation": "LTV stands for Loan to Value. It is a ratio used by lenders to express the ratio of a loan to the value of the asset purchased. For example if you're buying a home worth ₹5000000 and you take out a ₹4000000 loan the LTV ratio is 80%. Higher LTV ratios mean higher risk for the lender."
    },
    "3": {
      "name": "EMI (Equated Monthly Installment)",
      "explanation": "EMI stands for Equated Monthly Installment. It is the amount you pay every month towards your loan. The EMI includes both the principal amount and the interest. It is calculated based on the loan amount interest rate and tenure."
    },
    "4": {
      "name": "FSI (Floor Space Index)",
      "explanation": "FSI is the ratio of a building's total floor area to the size of the piece of land upon which it is built."
    },
    "5": {
      "name": "Carpet Area",
      "explanation": "Carpet Area is the actual usable area of an apartment or house excluding the thickness of the inner walls. Simply put it's the area where you can lay a carpet. This is different from the built-up area or super built-up area which include additional spaces like balconies and common areas."
    },
    "6": {
      "name": "Rental Yield",
      "explanation": "Rental Yield is the rate of income return over the cost associated with an investment property, typically expressed as a percentage."
    },
    "7": {
      "name": "Market Value",
      "explanation": "Market Value is the estimated amount for which a property should exchange on the date of valuation between a willing buyer and a willing seller in an arm's length transaction. It's the price the property would fetch in the current market conditions."
    },
    "8": {
      "name": "Replacement Cost",
      "explanation": "Replacement Cost is the cost to replace or rebuild the property with one of similar quality and utility at current prices. This can be different from the Market Value as it does not take into account the land value or location."
    },
    "9": {
      "name": "Open House",
      "explanation": "Open House is a scheduled period of time in which a property for sale or rent is made available for viewing by prospective buyers or tenants."
    }
  }
};

// Helper function to get term options
function getTermOptions() {
  return Object.keys(faqData.terms).map(key => `${key}. ${faqData.terms[key].name}`);
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('a user connected');

      // Send welcome message and options
      socket.emit('message', { message: faqData.welcomeMessage, options: getTermOptions() });

      // Handle user choice
      socket.on('choose', (choice) => {
        if (faqData.terms[choice]) {
          socket.emit('message', { message: faqData.terms[choice].explanation, options: ["Yes", "No"] });
        } else {
          socket.emit('message', { message: "Invalid choice. Please choose a valid term.", options: getTermOptions() });
        }
      });

      // Handle continuation
      socket.on('continue', (continueChoice) => {
        if (continueChoice.toLowerCase() === "yes") {
          socket.emit('message', { message: "Wonderful! Which term would you like to know more about?", options: getTermOptions() });
        } else if (continueChoice.toLowerCase() === "no") {
          socket.emit('message', { message: "Great! I hope you found the explanations helpful. If you have any more questions in the future feel free to ask. Have a wonderful day!" });
        } else {
          socket.emit('message', { message: "Invalid choice. Please choose 'Yes' or 'No'.", options: ["Yes", "No"] });
        }
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
  res.end();
};

export default SocketHandler;
