import { query } from "../_generated/server";

export const getPatientDemographics = query({
  args: {},
  handler: async (ctx) => {
    const patients = await ctx.db.query("patients").collect();

    const genderCount = {
      male: 0,
      female: 0,
      other: 0,
    };

    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    };

    patients.forEach(patient => {
      // Count gender
      genderCount[patient.gender]++;

      // Calculate age and group
      const birthDate = new Date(patient.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    });

    return {
      gender: genderCount,
      ageGroups,
      total: patients.length,
    };
  },
});