import { JSONPath } from 'jsonpath-plus';

const buildContextFromConfig = (sessionData, assessmentConfig) => {
    try {
        const context = {
            assessmentInfo: {
                id: sessionData.assessment_id,
                name: assessmentConfig.assessment_name,
                sessionId: sessionData.session_id
            },
            sections: []
        };

        
        const sections = assessmentConfig.sections || assessmentConfig.reportSections; // Handle both naming styles
        
        sections.forEach(sectionConfig => {
            const sectionData = {
                title: sectionConfig.section_name,
                fields: []
            };

          
            sectionConfig.fields.forEach(fieldConfig => {
                const fieldData = processFieldData(sessionData, fieldConfig);
                sectionData.fields.push(fieldData);
            });

            context.sections.push(sectionData);
        });

        return context;

    } catch (error) {
        console.log('Context building error:', error);
        throw error;
    }
};

const processFieldData = (sessionData, fieldConfig) => {
    try {
        // Extracting value using JSONPath
        const jsonPath = fieldConfig.extractFrom || fieldConfig.extractfrom; // Handle both naming styles
        const extractedValue = JSONPath({ path: jsonPath, json: sessionData });
        
        const value = extractedValue.length > 0 ? extractedValue[0] : null;

        // field data object
        const fieldData = {
            label: fieldConfig.label,
            value: formatFieldValue(value, fieldConfig),
            unit: fieldConfig.unit || '',
            rawValue: value
        };

        // Add classification if available
        if (fieldConfig.classification && value !== null) {
            fieldData.classification = classifyValue(value, fieldConfig.classification.ranges);
        }

        return fieldData;

    } catch (error) {
        console.log(`Error processing field ${fieldConfig.label}:`, error);
        return {
            label: fieldConfig.label,
            value: 'N/A',
            unit: fieldConfig.unit || '',
            rawValue: null
        };
    }
};

const formatFieldValue = (value, fieldConfig) => {
    if (value === null || value === undefined) return 'N/A';

    // Handle date formatting
    if (fieldConfig.format === 'date') {
        return new Date(value).toLocaleDateString();
    }

    // Handling numeric values
    if (typeof value === 'number') {
        return value.toFixed(1);
    }

    return value.toString();
};

const classifyValue = (value, ranges) => {
    if (!ranges || !Array.isArray(ranges)) return null;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    for (const range of ranges) {
        if (numValue >= range.min && numValue <= range.max) {
            return {
                status: range.status,
                color: range.color
            };
        }
    }

    return { status: 'Unknown', color: 'gray' };
};

export default buildContextFromConfig;