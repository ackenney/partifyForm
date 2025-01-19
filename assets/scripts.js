const yearDropdown = document.getElementById("year");
        const makeDropdown = document.getElementById("make");
        const modelDropdown = document.getElementById("model");
        const productTypeDropdown = document.getElementById("productType");
        const findPartButton = document.getElementById("findPartButton");

        let data = {};

        // Enable/disable the findMyPart button
        function updateFindPartButton() {
            if (yearDropdown.value && makeDropdown.value && modelDropdown.value && productTypeDropdown.value) {
                findPartButton.disabled = false;
            } else {
                findPartButton.disabled = true;
            }
        }

        // Parse CSV data 
        function parseCSV(content) {
            const lines = content.split("\n").slice(1).map(line => line.split(",")); // Skip header 
            data = {};

            lines.forEach(([year, make, model, productType, url]) => {
                if (!data[year]) data[year] = {};
                if (!data[year][make]) data[year][make] = {};
                if (!data[year][make][model]) data[year][make][model] = [];
                data[year][make][model].push({ productType, url });
            });

            populateYearDropdown();
        }

        // Populate yearDropdown
        function populateYearDropdown() {
            yearDropdown.innerHTML = '<option value="">Select Year</option>';
            Object.keys(data).filter(year => year.trim() !== "").forEach(year => { // Remove empty entries
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
            yearDropdown.disabled = false;
        }

        // Year dropdown
        yearDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            makeDropdown.innerHTML = '<option value="">Select Make</option>';
            modelDropdown.innerHTML = '<option value="">Select Model</option>';
            productTypeDropdown.innerHTML = '<option value="">Select Product Type</option>';
            modelDropdown.disabled = true;
            productTypeDropdown.disabled = true;

            if (selectedYear) {
                const makes = Object.keys(data[selectedYear]);
                makes.forEach(make => {
                    const option = document.createElement("option");
                    option.value = make;
                    option.textContent = make;
                    makeDropdown.appendChild(option);
                });
                makeDropdown.disabled = false;
            } else {
                makeDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        //Make dropdown
        makeDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            const selectedMake = makeDropdown.value;
            modelDropdown.innerHTML = '<option value="">Select Model</option>';
            productTypeDropdown.innerHTML = '<option value="">Select Product Type</option>';
            productTypeDropdown.disabled = true;

            if (selectedMake) {
                const models = Object.keys(data[selectedYear][selectedMake]);
                models.forEach(model => {
                    const option = document.createElement("option");
                    option.value = model;
                    option.textContent = model;
                    modelDropdown.appendChild(option);
                });
                modelDropdown.disabled = false;
            } else {
                modelDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        // Model dropdown
        modelDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            const selectedMake = makeDropdown.value;
            const selectedModel = modelDropdown.value;
            productTypeDropdown.innerHTML = '<option value="">Select Product Type</option>';

            if (selectedModel) {
                const productTypes = data[selectedYear][selectedMake][selectedModel];
                productTypes.forEach(({ productType, url }) => {
                    const option = document.createElement("option");
                    option.value = url;
                    option.textContent = productType;
                    productTypeDropdown.appendChild(option);
                });
                productTypeDropdown.disabled = false;
            } else {
                productTypeDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        // Product Type dropdown
        productTypeDropdown.addEventListener("change", updateFindPartButton);

        // Find My Part button
        findPartButton.addEventListener("click", () => {
            const selectedURL = productTypeDropdown.value;
            if (selectedURL) {
                window.open(selectedURL, "_blank");
            }
        });

        // Loading the csv file
        fetch("assets/Year Make Model Product Type Dataset.csv")
            .then(response => response.text())
            .then(content => parseCSV(content))
            .catch(error => console.error("Error loading CSV data file:", error));