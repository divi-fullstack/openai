export default async function handler(req, res) {
    try {
        const faqData = {
            "welcomeMessage": "Hello! Welcome to the ChatRLT by Birla Estates. I’m here to help you understand those tricky terms in the real estate world. How can I assist you today?",
            "terms": {
                "1": {
                    "name": "Floor Rise",
                    "explanation": "Floor Rise refers to the additional cost per square foot for apartments located on higher floors. This cost is added because higher floors often provide better views and are less noisy. For example, if an apartment on the 10th floor costs more per square foot than one on the 1st floor, that's due to Floor Rise."
                },
                "2": {
                    "name": "LTV (Loan to Value)",
                    "explanation": "LTV stands for Loan to Value. It is a ratio used by lenders to express the ratio of a loan to the value of the asset purchased. For example, if you're buying a home worth ₹5,000,000 and you take out a ₹4,000,000 loan, the LTV ratio is 80%. Higher LTV ratios mean higher risk for the lender."
                },
                "3": {
                    "name": "EMI (Equated Monthly Installment)",
                    "explanation": "EMI stands for Equated Monthly Installment. It is the amount you pay every month towards your loan. The EMI includes both the principal amount and the interest. It is calculated based on the loan amount, interest rate, and tenure."
                },
                "4": {
                    "name": "FSI (Floor Space Index)",
                    "explanation": "FSI is the ratio of a building's total floor area to the size of the piece of land upon which it is built."
                },
                "5": {
                    "name": "Carpet Area",
                    "explanation": "Carpet Area is the actual usable area of an apartment or house excluding the thickness of the inner walls. Simply put, it's the area where you can lay a carpet. This is different from the built-up area or super built-up area which includes additional spaces like balconies and common areas."
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
        
        const knowMore = [
            "Would you like to know about another term?",
            "Would you like to explore another term?",
            "Would you like information on another term?",
            "Any other term you'd like to know about?",
            "Do you need information on another term?",
            "Interested in any other terms?"
        ]
        
        const selectionPrefix = [
            "",
            "Great choice!",
            "Sure!",
            "Absolutely!"
        ]
        

        function getRandomStringFromArray(arr) {
            if (!Array.isArray(arr) || arr.length === 0) {
                throw new Error('Input must be a non-empty array');
            }
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }

        function getTermOptions() {
            return Object.keys(faqData.terms).map(key => ({ id: key, option: `${key}. ${faqData.terms[key].name}` }));
        }

        const body = JSON.parse(req.body);

        if (body.stage === "start") {
            res.json({ message: faqData.welcomeMessage, optionTitle: "", options: [] });
        } else if (body.stage === "afterstart") {
            res.json({ message: "Which term would you like to know more about? Please choose an option below:", optionTitle: "", options: getTermOptions() });
        } else if (body.stage === "choose") {
            const choice = body.messages[body.messages.length - 1].content.id;
            if (choice.toLowerCase() === "yes") {
                res.json({ message: "Wonderful! Which term would you like to know more about? Please choose an option below:", optionTitle: "", options: getTermOptions() });
            } else if (choice.toLowerCase() === "no") {
                res.json({ message: "Great! I hope you found the explanations helpful. If you have any more questions in the future feel free to ask. Have a wonderful day!", optionTitle: "", options: [] });
            } else if (faqData.terms[choice]) {
                res.json(
                    {
                        message: `${getRandomStringFromArray(selectionPrefix)} ${faqData.terms[choice].explanation}`,
                        optionTitle: getRandomStringFromArray(knowMore),
                        options: [{ id: "yes", option: "Yes" }, { id: "no", option: "No" }]
                    }
                );
            } else {
                res.json({ message: "Invalid choice. Please choose a valid term.", optionTitle: "", options: getTermOptions() });
            }
        } else {
            res.status(400).json({ message: "Invalid stage provided.", optionTitle: "", options: [] })
        }

    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Error generating text' });
    }
}