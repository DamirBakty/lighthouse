echo "initial auth and appsetup"
python3 manage.py loaddata ./fixtures/group.json
python3 manage.py loaddata ./fixtures/user.json
python3 manage.py loaddata ./fixtures/user_groups.json
python3 manage.py loaddata ./fixtures/appsetup.json

echo "initial material, formula, components"
python3 manage.py loaddata ./fixtures/refmaterialtype.json
python3 manage.py loaddata ./fixtures/materialunit.json
python3 manage.py loaddata ./fixtures/tare.json
python3 manage.py loaddata ./fixtures/material.json
python3 manage.py loaddata ./fixtures/formula.json
python3 manage.py loaddata ./fixtures/formulacomp.json

echo "initial org"
python3 manage.py loaddata ./fixtures/org.json
python3 manage.py loaddata ./fixtures/department.json
python3 manage.py loaddata ./fixtures/staff.json
python3 manage.py loaddata ./fixtures/employee.json

echo "initial expense"
python3 manage.py loaddata ./fixtures/refcost.json
python3 manage.py loaddata ./fixtures/cost.json

echo "initial factory"
python3 manage.py loaddata ./fixtures/productionline.json
python3 manage.py loaddata ./fixtures/productionwork.json
python3 manage.py loaddata ./fixtures/manufacture.json
python3 manage.py loaddata ./fixtures/prodteam.json
python3 manage.py loaddata ./fixtures/prodcalc.json
python3 manage.py loaddata ./fixtures/prodreadyproduct.json

echo "initial sales"
python3 manage.py loaddata ./fixtures/client.json
python3 manage.py loaddata ./fixtures/contract.json
python3 manage.py loaddata ./fixtures/contractspec.json
python3 manage.py loaddata ./fixtures/claim.json
python3 manage.py loaddata ./fixtures/claimhistory.json
python3 manage.py loaddata ./fixtures/pricelist.json
python3 manage.py loaddata ./fixtures/reservation.json
python3 manage.py loaddata ./fixtures/contractexpectedpayment.json
python3 manage.py loaddata ./fixtures/paymentmethod.json
python3 manage.py loaddata ./fixtures/payment.json

echo "initial store"
python3 manage.py loaddata ./fixtures/store.json
