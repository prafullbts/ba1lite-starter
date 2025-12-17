/**
 * Verity Score Service
 * 
 * Reusable service to fetch Verity scores from Pulse Backend and set them in the calc model.
 * The score is stored as VerityScoreResult_{botId} in the backend and set to tlInputVerityScore_R1/R2 in the model.
 */

import { loadState, saveState } from '@/services/stateService';
import { getQuestionToSend } from '@/utils/config';
import { VERITY_SCORE_RANGE_NAMES as VERITY_RANGE_NAMES } from '@/Sim/RangeNameMap';

// Verity Bot IDs for each round (matching VerityChatPage configuration)
const VERITY_BOT_IDS: Record<string, string> = {
  '1': 'comp-CoverMyMed-3wobb/WOR9DhDB8QWDE4inXuJW',
  '2': 'comp-CoverMyMed-3wobb/nB1W9fUXTjFHU1Uw8hEx',
};

/**
 * Get the Verity score question name for a given round
 * The question name uses only the bot ID suffix (after the last '/')
 * @param round - Round number as string ('1' or '2')
 * @returns Question name for LoadState API (e.g., "VerityScoreResult_WOR9DhDB8QWDE4inXuJW")
 */
function getVerityScoreQuestionName(round: string): string {
  const botId = VERITY_BOT_IDS[round];
  if (!botId) {
    throw new Error(`Invalid round: ${round}. Must be '1' or '2'`);
  }
  // Extract the suffix after the last '/' (e.g., "WOR9DhDB8QWDE4inXuJW")
  const botIdSuffix = botId.split('/').pop();
  if (!botIdSuffix) {
    throw new Error(`Invalid bot ID format for round ${round}: ${botId}`);
  }
  return `VerityScoreResult_${botIdSuffix}`;
}

/**
 * Get the range name for a given round
 * @param round - Round number as string ('1' or '2')
 * @returns Range name in calc model (e.g., "tlInputVerityScore_R1")
 */
function getVerityScoreRangeName(round: string): string {
  if (round === '1') {
    return VERITY_RANGE_NAMES.VERITY_SCORE_ROUND_1;
  } else if (round === '2') {
    return VERITY_RANGE_NAMES.VERITY_SCORE_ROUND_2;
  } else {
    throw new Error(`Invalid round: ${round}. Must be '1' or '2'`);
  }
}

/**
 * Fetch Verity score from backend and set it in the calc model
 * 
 * @param round - Round number as string ('1' or '2')
 * @param setValue - Function to set value in calc model (from useCalc hook)
 * @param getValue - Function to get value from calc model (from useCalc hook) - optional, for checking existing value
 * @returns Promise<{ success: boolean; score?: string; message?: string }>
 */
export async function fetchAndSetVerityScore(
  round: string,
  setValue: (refName: string, value: any, componentName?: string) => Promise<void>,
  getValue?: (refName: string, rawValue?: boolean) => string
): Promise<{ success: boolean; score?: string; message?: string }> {
  try {
    // Validate round
    if (!VERITY_BOT_IDS[round]) {
      return {
        success: false,
        message: `Invalid round: ${round}. Must be '1' or '2'`,
      };
    }

    const questionName = getVerityScoreQuestionName(round);
    const rangeName = getVerityScoreRangeName(round);

    console.log(`🔍 Fetching Verity score for Round ${round}...`);
    console.log(`   Question name: ${questionName}`);
    console.log(`   Range name: ${rangeName}`);

    // Check if score already exists in calc model
    if (getValue) {
      const existingValue = getValue(rangeName, true);
      if (existingValue && existingValue !== '0' && existingValue !== '' && !String(existingValue).startsWith('#')) {
        console.log(`✅ Verity score already exists in calc model: ${rangeName} = ${existingValue}`);
        return {
          success: true,
          score: existingValue,
          message: `Score already loaded: ${existingValue}`,
        };
      }
    }

    // Fetch score from backend using LoadState API
    const response = await loadState([questionName]);
    
    if (!response || !response[questionName]) {
      return {
        success: false,
        message: `No Verity score found in backend for Round ${round}. The score may not be available yet.`,
      };
    }

    const score = response[questionName];
    
    // Validate score (should be a number)
    if (score === null || score === undefined || score === '' || score === '0') {
      return {
        success: false,
        message: `Verity score is empty or zero for Round ${round}.`,
      };
    }

    // Check for error values
    if (typeof score === 'string' && score.startsWith('#')) {
      return {
        success: false,
        message: `Verity score contains an error value: ${score}`,
      };
    }

    console.log(`📥 Fetched Verity score from backend: ${score}`);

    // Set the score in calc model
    await setValue(rangeName, score, 'VerityScoreService');
    console.log(`✅ Set Verity score in calc model: ${rangeName} = ${score}`);

    // Retain the score in backend so it persists across refresh/logout
    // Get all questions to send (includes tlInput questions)
    const questionsToSend = await getQuestionToSend();
    
    // Check if the range name is in questionsToSend
    if (questionsToSend.includes(rangeName)) {
      // Prepare the value to retain (as string)
      const valueToRetain: Record<string, string> = {
        [rangeName]: String(score),
      };
      
      // Save to backend using RetainState
      await saveState(valueToRetain);
      console.log(`💾 Retained Verity score in backend: ${rangeName} = ${score}`);
    } else {
      console.warn(`⚠️ Range name ${rangeName} not found in questionsToSend. Score will not be retained automatically.`);
    }

    return {
      success: true,
      score: String(score),
      message: `Successfully fetched and set Verity score: ${score}`,
    };
  } catch (error) {
    console.error(`❌ Error fetching/setting Verity score for Round ${round}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred while fetching Verity score',
    };
  }
}

/**
 * Get Verity Bot ID for a given round (useful for other components)
 * @param round - Round number as string ('1' or '2')
 * @returns Bot ID or null if invalid round
 */
export function getVerityBotId(round: string): string | null {
  return VERITY_BOT_IDS[round] || null;
}

