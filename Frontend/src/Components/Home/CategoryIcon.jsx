import React, { useEffect, useState } from "react";
import api from "../../api";
import PageContainer from "../CommenComponents/PageContainer";
import { Link } from "react-router-dom";
import Heading from "../Heading";
import { useContext } from "react";
import { StoreContext } from "../../PrivateRouter/StoreContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Cookie, Droplets, Leaf, Package, Sparkles, Wheat } from "lucide-react";
import "swiper/css";

const categoryThemes = [
  { keywords: ["fruit", "vegetable", "produce"], background: "from-lime-50 to-green-100", accent: "bg-lime-500", Icon: Leaf },
  { keywords: ["grocery", "staple", "grain"], background: "from-orange-50 to-amber-100", accent: "bg-amber-500", Icon: Wheat },
  { keywords: ["dairy", "breakfast", "milk"], background: "from-sky-50 to-blue-100", accent: "bg-sky-500", Icon: Droplets },
  { keywords: ["snack", "beverage", "drink"], background: "from-amber-50 to-orange-100", accent: "bg-orange-500", Icon: Cookie },
  { keywords: ["care", "beauty", "hygiene"], background: "from-fuchsia-50 to-purple-100", accent: "bg-fuchsia-500", Icon: Sparkles },
];

const CategoryIcon = () => {
  const { categoriesCache, setCategoriesCache } = useContext(StoreContext);
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache || categoriesCache.length === 0);

  const fetchCategories = async () => {
    try {
      if (categoriesCache && categoriesCache.length > 0) {
        setCategories(categoriesCache);
        setLoading(false);
        return;
      }

      const res = await api.get("/categories");
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
      setCategoriesCache(data);
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categoriesCache, setCategoriesCache]);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <PageContainer>
        {/* Section Heading */}

        <Heading title="Shop By Category" align="left" />
        {/* Categories container */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex h-40 w-36 shrink-0 flex-col items-center justify-between rounded-3xl border border-gray-100 bg-white p-3 shadow-sm animate-pulse"
              >
                <div className="mb-2 w-full flex-1 rounded-xl bg-gray-200" />
                <div className="flex w-full items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-gray-200" />
                  <div className="h-3 w-16 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            loop={categories.length > 8}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 2.2 },
              480: { slidesPerView: 3.2 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
          >
            {Array.isArray(categories) &&
              categories.map((cat) => {
                const name = String(cat?.name || "Category").trim();
                const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : String(cat?.id || "category");
                const normalizedName = name.toLowerCase();
                const theme = categoryThemes.find(({ keywords }) =>
                  keywords.some((keyword) => normalizedName.includes(keyword))
                ) || {
                  background: "from-slate-50 to-gray-100",
                  accent: "bg-green-600",
                  Icon: Package,
                };
                const CategoryGlyph = theme.Icon;

                return (
                  <SwiperSlide key={cat?.id || slug}>
                    <Link
                      to={`/category/${slug}`}
                      className={`group relative flex h-40 flex-col overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br ${theme.background} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    >
                      <div className="flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden px-2 pt-2">
                        <img
                          src={
                            cat?.images?.[0] ||
                            "https://images.unsplash.com/photo-1610030469983-98e550d6193c"
                          }
                          alt={name}
                          className="h-full w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      </div>

                      <div className="flex min-h-14 w-full items-center gap-2 bg-white/55 px-2.5 py-2 backdrop-blur-[2px]">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.accent} text-white`}>
                          <CategoryGlyph size={19} strokeWidth={2.2} />
                        </span>
                        <p className="line-clamp-2 text-xs font-extrabold leading-tight text-gray-900 md:text-sm">
                          {name}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        )}
      </PageContainer>
    </section>
  );
};

export default CategoryIcon;
