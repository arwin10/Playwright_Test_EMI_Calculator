import Logger from './logger';

const logger = new Logger('Validators');

export class EMIValidator {
  /**
   * Calculate EMI using standard formula
   * EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
   * P = Principal loan amount
   * R = Monthly interest rate (Annual Rate / 12 / 100)
   * N = Number of monthly installments
   */
  static calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
    if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
      throw new Error('Invalid input parameters for EMI calculation');
    }

    const monthlyRate = annualRate / (12 * 100);
    
    if (monthlyRate === 0) {
      return principal / tenureMonths;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return Math.round(emi);
  }

  /**
   * Calculate total interest payable
   */
  static calculateTotalInterest(emi: number, tenureMonths: number, principal: number): number {
    const totalAmount = emi * tenureMonths;
    return Math.round(totalAmount - principal);
  }

  /**
   * Calculate total amount payable
   */
  static calculateTotalAmount(emi: number, tenureMonths: number): number {
    return Math.round(emi * tenureMonths);
  }

  /**
   * Validate EMI with tolerance
   */
  static validateEMI(
    calculatedEMI: number,
    expectedEMI: number,
    tolerancePercent: number = 0.1
  ): { isValid: boolean; difference: number; differencePercent: number } {
    const difference = Math.abs(calculatedEMI - expectedEMI);
    const differencePercent = (difference / expectedEMI) * 100;
    const isValid = differencePercent <= tolerancePercent;

    if (!isValid) {
      logger.warn('EMI validation failed', {
        calculated: calculatedEMI,
        expected: expectedEMI,
        difference,
        differencePercent: differencePercent.toFixed(2) + '%',
      });
    } else {
      logger.step('EMI validation passed', {
        calculated: calculatedEMI,
        expected: expectedEMI,
      });
    }

    return { isValid, difference, differencePercent };
  }

  /**
   * Validate interest amount
   */
  static validateInterest(
    calculatedInterest: number,
    expectedInterest: number,
    tolerancePercent: number = 0.1
  ): boolean {
    const difference = Math.abs(calculatedInterest - expectedInterest);
    const differencePercent = (difference / expectedInterest) * 100;
    return differencePercent <= tolerancePercent;
  }

  /**
   * Validate total amount
   */
  static validateTotalAmount(
    calculatedTotal: number,
    expectedTotal: number,
    tolerancePercent: number = 0.1
  ): boolean {
    const difference = Math.abs(calculatedTotal - expectedTotal);
    const differencePercent = (difference / expectedTotal) * 100;
    return differencePercent <= tolerancePercent;
  }

  /**
   * Generate amortization schedule
   */
  static generateAmortizationSchedule(
    principal: number,
    annualRate: number,
    tenureMonths: number
  ): Array<{
    month: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }> {
    const emi = this.calculateEMI(principal, annualRate, tenureMonths);
    const monthlyRate = annualRate / (12 * 100);
    let remainingBalance = principal;
    const schedule = [];

    for (let month = 1; month <= tenureMonths; month++) {
      const interestPaid = Math.round(remainingBalance * monthlyRate);
      const principalPaid = emi - interestPaid;
      remainingBalance = Math.round(remainingBalance - principalPaid);

      if (remainingBalance < 0) remainingBalance = 0;

      schedule.push({
        month,
        emi,
        principalPaid,
        interestPaid,
        remainingBalance,
      });
    }

    return schedule;
  }

  /**
   * Validate input ranges
   */
  static validateInputRanges(
    principal: number,
    rate: number,
    tenure: number,
    minPrincipal: number = 10000,
    maxPrincipal: number = 100000000,
    minRate: number = 0.1,
    maxRate: number = 30,
    minTenure: number = 1,
    maxTenure: number = 360
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (principal < minPrincipal || principal > maxPrincipal) {
      errors.push(`Principal must be between ${minPrincipal} and ${maxPrincipal}`);
    }

    if (rate < minRate || rate > maxRate) {
      errors.push(`Rate must be between ${minRate}% and ${maxRate}%`);
    }

    if (tenure < minTenure || tenure > maxTenure) {
      errors.push(`Tenure must be between ${minTenure} and ${maxTenure} months`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default EMIValidator;
