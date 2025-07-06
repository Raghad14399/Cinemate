import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import { Input } from "../../../Components/UsedInputs";
import { MdSave, MdCancel } from "react-icons/md";
import { pricingService } from "../../../api/services";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";
import { toast } from "react-toastify";

function TicketPricing() {
  const [formData, setFormData] = useState({
    regular2D: "",
    regular3D: "",
    vip2D: "",
    vip3D: "",
  });

  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  // استخدام هوك معالجة أخطاء المصادقة
  const {
    loading: isLoading,
    setLoading: setIsLoading,
    error,
    setError,
    executeApiCall,
  } = useAuthErrorHandler("An error occurred while updating pricing.");

  // دالة لتحميل الأسعار الحالية
  const loadCurrentPrices = async () => {
    try {
      setIsLoadingPrices(true);
      setError("");

      // جلب الأسعار من السيرفر
      const response = await executeApiCall(async () => await pricingService.getPricingValues());

      if (response && response.data && response.data.data) {
        const pricesArr = response.data.data;
        // تحويل المصفوفة إلى كائن باسم السعر
        const pricesObj = {};
        pricesArr.forEach(item => {
          pricesObj[item.name] = item.value;
        });
        // تحديث النموذج بالأسعار المحملة
        const newFormData = {
          regular2D: pricesObj.Standard2dPricing || "",
          regular3D: pricesObj.Standard3dPricing || "",
          vip2D: pricesObj.Vip2dPricing || "",
          vip3D: pricesObj.Vip3dPricing || "",
        };
        setFormData(newFormData);
        localStorage.setItem("ticketPrices", JSON.stringify(newFormData));
      } else {
        // إذا لم تكن هناك أسعار من الخادم، محاولة تحميلها من localStorage
        loadPricesFromLocalStorage();
      }
    } catch (error) {
      console.error("Error loading current prices:", error);
      // في حالة فشل تحميل الأسعار من الخادم، محاولة تحميلها من localStorage
      loadPricesFromLocalStorage();
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // دالة لتحميل الأسعار من localStorage
  const loadPricesFromLocalStorage = () => {
    try {
      const savedPrices = localStorage.getItem("ticketPrices");
      if (savedPrices) {
        const parsedPrices = JSON.parse(savedPrices);
        setFormData(parsedPrices);
        console.log("Loaded prices from localStorage:", parsedPrices);
      }
    } catch (error) {
      console.error("Error loading prices from localStorage:", error);
    }
  };

  // تحميل الأسعار عند تحميل المكون
  useEffect(() => {
    loadCurrentPrices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    // السماح بالأرقام والنقطة العشرية فقط
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const newFormData = {
        ...formData,
        [name]: value,
      };
      setFormData(newFormData);

      // حفظ التغييرات في localStorage فوراً
      localStorage.setItem("ticketPrices", JSON.stringify(newFormData));

      // إزالة رسالة الخطأ عند التغيير
      if (error) {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    const emptyFields = Object.keys(formData).filter(
      (key) => formData[key] === ""
    );
    const invalidFields = Object.keys(formData).filter(
      (key) =>
        formData[key] !== "" &&
        (isNaN(parseFloat(formData[key])) || parseFloat(formData[key]) <= 0)
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in all price fields: ${emptyFields.join(", ")}`);
      return;
    }

    if (invalidFields.length > 0) {
      setError(
        `Please enter valid prices (greater than 0) for: ${invalidFields.join(
          ", "
        )}`
      );
      return;
    }

    // التحقق من أن الأسعار معقولة (أقل من 10000)
    const expensiveFields = Object.keys(formData).filter(
      (key) => parseFloat(formData[key]) > 10000
    );

    if (expensiveFields.length > 0) {
      setError(
        `Prices seem too high (over 10000) for: ${expensiveFields.join(
          ", "
        )}. Please verify.`
      );
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // إرسال كل سعر بشكل منفصل
      const pricingUpdates = [
        {
          type: pricingService.PRICING_TYPES.STANDARD_2D,
          value: parseFloat(formData.regular2D),
          name: "Standard 2D",
        },
        {
          type: pricingService.PRICING_TYPES.STANDARD_3D,
          value: parseFloat(formData.regular3D),
          name: "Standard 3D",
        },
        {
          type: pricingService.PRICING_TYPES.VIP_2D,
          value: parseFloat(formData.vip2D),
          name: "VIP 2D",
        },
        {
          type: pricingService.PRICING_TYPES.VIP_3D,
          value: parseFloat(formData.vip3D),
          name: "VIP 3D",
        },
      ];

      console.log("Updating pricing with data:", pricingUpdates);

      // تحديث كل سعر
      for (const update of pricingUpdates) {
        console.log(
          `Updating ${update.name} (type ${update.type}) to ${update.value}`
        );
        await executeApiCall(
          async () =>
            await pricingService.setPricingValue(update.type, update.value)
        );
        console.log(`✅ ${update.name} updated successfully`);
      }

      console.log("✅ All pricing updated successfully!");

      // حفظ الأسعار المحدثة في localStorage
      localStorage.setItem("ticketPrices", JSON.stringify(formData));

      // عرض رسالة نجاح بسيطة باستخدام التوست
      toast.success("All pricing updated successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("❌ Error updating pricing:", err);
      setError(err.message || "Failed to update pricing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // إعادة تحميل الأسعار المحفوظة بدلاً من مسحها
    loadPricesFromLocalStorage();
    setError("");
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Ticket Pricing</h2>

        {/* عرض مؤشر تحميل الأسعار */}
        {isLoadingPrices && (
          <div className="bg-blue-100 bg-opacity-10 border border-blue-500 border-opacity-30 text-blue-500 p-4 rounded-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            Loading current prices...
          </div>
        )}

        {/* عرض رسالة الخطأ */}
        {error && (
          <div className="bg-red-100 bg-opacity-10 border border-red-500 border-opacity-30 text-red-500 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* حقول الأسعار */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          {/* Standard 2D */}
          <Input
            label="Standard Quality 2D Price"
            placeholder="Enter price for Standard 2D"
            type="text"
            bg={true}
            name="regular2D"
            value={formData.regular2D}
            onChange={handleChange}
            disabled={isLoading || isLoadingPrices}
            currency="SYP"
          />

          {/* Standard 3D */}
          <Input
            label="Standard Quality 3D Price"
            placeholder="Enter price for Standard 3D"
            type="text"
            bg={true}
            name="regular3D"
            value={formData.regular3D}
            onChange={handleChange}
            disabled={isLoading || isLoadingPrices}
            currency="SYP"
          />
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          {/* VIP 2D */}
          <Input
            label="VIP Quality 2D Price"
            placeholder="Enter price for VIP 2D"
            type="text"
            bg={true}
            name="vip2D"
            value={formData.vip2D}
            onChange={handleChange}
            disabled={isLoading || isLoadingPrices}
            currency="SYP"
          />

          {/* VIP 3D */}
          <Input
            label="VIP Quality 3D Price"
            placeholder="Enter price for VIP 3D"
            type="text"
            bg={true}
            name="vip3D"
            value={formData.vip3D}
            onChange={handleChange}
            disabled={isLoading || isLoadingPrices}
            currency="SYP"
          />
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
          {/* زر الحفظ */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || isLoadingPrices}
              className={`font-medium transitions border border-beige3 flex-rows gap-4 text-white py-3 px-20  rounded-2xl w-full sm:w-auto ${
                isLoading || isLoadingPrices
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-main hover:bg-beige3"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <MdSave size={20} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default TicketPricing;
