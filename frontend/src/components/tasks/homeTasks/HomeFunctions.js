import axios from 'axios'
import { validateBridgeNode } from '../editorTasks/ValidateFlow';

// "HomeFunction.js" handles fetching all validated flows from the backend server and database.
// Its prior use is in the "Home" component.
export const handleGetAllValidatedFlows = async () => {
    try {
        const response = await axios.get('http://localhost:3005/getAllValidatedFlows');
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error in fetching validated flows from the server.');
        }
    } catch (error) {
        console.error('Error in handleGetAllValidatedFlows', error);
        throw error;
    }
}

export const handleGetValidatedFlowsCategories = async (validatedFlowsNames) => {
    try {
        const response = await axios.post('http://localhost:3005/getValidatedFlowsCategories', {
            titlesAndFlowKeys: validatedFlowsNames
        });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error while fetching validated flows categories from the server.');
        }
    } catch (error) {
        console.error('Error in handleGetValidatedFlowsDetails', error);
    }
};

export const handleGetValidatedFlowsDetails = async (validatedFlowsNames) => {
    try {
        const response = await axios.post('http://localhost:3005/getValidatedFlowsDetails', {
            titlesAndFlowKeys: validatedFlowsNames
        });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error while fetching validated flows details from the server.');
        }
    } catch (error) {
        console.error('Error in handleGetValidatedFlowsDetails', error);
    }
}

export const handleSearchAudiobooks = (searchValue, validatedDetails) => {
    console.log('searchValue in HomeFunctions:', searchValue, validatedDetails);
    const searchResults = [];

    try {
        const lowerCaseSearchValue = searchValue.toLowerCase();

        for (const detail of validatedDetails) {
            const { title, description, author, category, contributors } = detail;

            if (
                (title && title.toLowerCase().includes(lowerCaseSearchValue)) ||
                (description && description.toLowerCase().includes(lowerCaseSearchValue)) ||
                (author && author.toLowerCase().includes(lowerCaseSearchValue)) ||
                (category && category.toLowerCase().includes(lowerCaseSearchValue)) ||
                (contributors && contributors.some(contributor => contributor.toLowerCase().includes(lowerCaseSearchValue)))
            ) {
                searchResults.push(title);
            }
        }
    } catch (error) {
        console.error("Error while searching for audiobooks.")
    }

    return searchResults;
}