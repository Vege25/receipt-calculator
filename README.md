# receipt-calculator
## Idea
This app scans your shop receipt, get's all bought item's prices and total price.
User can split the payments for each bought item with partner.
## *IMPORTANT* Works on only finnish receipts

## Example
George and Mary wants to calculate the receipt.
George bought milk and half of the chicken.
Mary bought half of the chicken and juice.

RECEIPT:
Milk 1,0€ (George)
Chicken 3,0€ (George, Mary)
Juice 1,0€ (Mary)

Total: 5,0€

Then calculator calculates Georges part of the receipt
1,0 + (3,0 / 2) = 2,5

Then calculator calculates Marys part of the receipt
5,0 - 2,5 = 2,5 (5,0 as the total)

App informs user about the cost

## Potential errors
- If scanning fails -> inform user that receipt is unvalid
- If Prices does not match total -> inform user to check the prices and modify
