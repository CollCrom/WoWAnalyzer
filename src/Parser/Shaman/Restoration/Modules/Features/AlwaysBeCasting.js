import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';

import CoreAlwaysBeCastingHealing from 'Parser/Core/Modules/AlwaysBeCastingHealing';

const HEALING_ABILITIES_ON_GCD = [
  SPELLS.HEALING_WAVE.id,
  SPELLS.CHAIN_HEAL.id,
  SPELLS.HEALING_SURGE_RESTORATION.id,
  SPELLS.RIPTIDE.id,
  SPELLS.HEALING_RAIN_CAST.id,
  SPELLS.HEALING_STREAM_TOTEM_CAST.id,
  SPELLS.HEALING_TIDE_TOTEM_CAST.id,
  SPELLS.SPIRIT_LINK_TOTEM.id,
  SPELLS.GIFT_OF_THE_QUEEN.id,
  SPELLS.WELLSPRING_TALENT.id,
  SPELLS.CLOUDBURST_TOTEM_TALENT.id,
  SPELLS.EARTHEN_SHIELD_TOTEM_TALENT.id,
  SPELLS.UNLEASH_LIFE_TALENT.id,
];

const TOTEM_GCD = 1000; // Totems have a set GCD of 1 second

class AlwaysBeCasting extends CoreAlwaysBeCastingHealing {
  static HEALING_ABILITIES_ON_GCD = HEALING_ABILITIES_ON_GCD;
  static ABILITIES_ON_GCD = [
    ...HEALING_ABILITIES_ON_GCD,
    192063, // Gust of Wind
    192077, // Wind Rush Totem
    192058, // Lightning Surge Totem
    51485, // Earthgrab totem
    196932, // Voodoo totem
    207399, // APT
    403, // Lightning Bolt
    188838, // Flame shock
    2484, // Earthbind totem
    51505, // Lava Burst
    6196, // Far sight
    2645, // Ghost wolf
    77130, // Purify spirit
    421, // Chain lightning
    546, // water walking
    211004, 51514, 211010, 210873, 211015, // Variants of hex
    556, // Astral recall
    370, // purge
  ];

  static STATIC_GCD_ABILITIES = {
    [SPELLS.HEALING_TIDE_TOTEM_CAST.id]: TOTEM_GCD,
    [SPELLS.SPIRIT_LINK_TOTEM.id]: TOTEM_GCD,
    [SPELLS.HEALING_STREAM_TOTEM_CAST.id]: TOTEM_GCD,
    [SPELLS.CLOUDBURST_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.EARTHEN_SHIELD_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.WIND_RUSH_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.LIGHTNING_SURGE_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.EARTHGRAB_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.VOODOO_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.ANCESTRAL_PROTECTION_TOTEM_TALENT.id]: TOTEM_GCD,
    [SPELLS.EARTHBIND_TOTEM.id]: TOTEM_GCD, // Not a static GCD but 1 second - haste
  }
  
  suggestions(when) {
    const nonHealingTimeSuggestionThresholds = this.nonHealingTimeSuggestionThresholds;
    const deadTimePercentage = this.downtimeSuggestionThresholds;
    when(nonHealingTimeSuggestionThresholds.actual).isGreaterThan(nonHealingTimeSuggestionThresholds.isGreaterThan.minor)
      .addSuggestion((suggest, actual, recommended) =>
        suggest(`Your non healing time can be improved. Try to cast heals more regularly (${Math.round(nonHealingTimeSuggestionThresholds.actual * 100)}% non healing time).`)
          .icon('petbattle_health-down')
          .actual(`${formatPercentage(nonHealingTimeSuggestionThresholds.actual)}% non healing time`)
          .recommended(`<${formatPercentage(nonHealingTimeSuggestionThresholds.isGreaterThan.minor)}% is recommended`)
          .regular(nonHealingTimeSuggestionThresholds.isGreaterThan.average).major(nonHealingTimeSuggestionThresholds.isGreaterThan.major)
      );
    when(deadTimePercentage.actual).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) =>
        suggest(`Your downtime can be improved. Try to Always Be Casting (ABC); when you're not healing try to contribute some damage.`)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(deadTimePercentage.actual)}% downtime`)
          .recommended(`<${formatPercentage(deadTimePercentage.isGreaterThan.minor)}% is recommended`)
          .regular(deadTimePercentage.isGreaterThan.average).major(deadTimePercentage.isGreaterThan.major)
      );
  }
}

export default AlwaysBeCasting;
