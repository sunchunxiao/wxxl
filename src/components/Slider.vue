<template>
  <div
    class="slider"
    :style="{height:height}">
    <div
      class="prev_wrap">
      <div
        @click="goPrev"
        :class="{is_click: hasLeft}"
        v-show="hasLeft || hasRight">
        <i class="el-icon-arrow-left" />
      </div>
    </div>
    <div class="slider_wrap">
      <slot />
    </div>
    <div
      class="next_wrap">
      <div
        @click="goNext"
        :class="{is_click: hasRight}"
        v-show="hasLeft || hasRight">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        height: {
            type: String,
            default: "200px"
        },
        minMoveNum: { // 最小移动距离
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            hasLeft: false,
            hasRight: false,
            sliderItems: [],
            slider_wrap: null,
            isSetTransition: false
        };
    },
    mounted() {
        this.addClassName();
        this.sliderItems = this.$el.querySelectorAll(".slider_wrap >.slider_item");
        this.sliderWrap = this.$el.querySelector(".slider_wrap");
        this.setTranslateX();
        this.judgeCanClick();
        window.addEventListener("resize", this.resize);
        window.onresize = this.judgeCanClick;
    },
    destroyed() {
        window.removeEventListener("resize", this.resize);
        window.onresize = null;
    },
    methods: {
        resize() {
            let lastSliderItem = this.sliderItems[this.sliderItems.length - 1];
            let lastNum = this.getTranslateX(lastSliderItem);
            if (lastNum + lastSliderItem.offsetWidth < this.sliderWrap.offsetWidth) {
                let firstNum = this.getTranslateX(this.sliderItems[0]);
                if (!firstNum) {
                    firstNum = 0;
                }
                let translateXNum = firstNum + this.sliderWrap.offsetWidth - lastNum - lastSliderItem.offsetWidth;
                translateXNum > 0 && (translateXNum =0);
                this.sliderItems[0].style.transform = "translateX(" + translateXNum + "px)";
                this.clearTransition();
                this.setTranslateX();
            }
        },
        addClassName() {
            if (!this.$slots.default) {
                return;
            }
            for (let i of this.$slots.default) {
                i.elm.className = i.elm.className + " slider_item";
            }
        },
        setIsClick(propName, value) {
            this[propName] = value;
        },
        goPrev() {
            if (!this.isSetTransition) {
                this.setTransition();
            }
            let firstSliderItem = this.sliderItems[0];
            let nextNum;
            this.sliderItems.forEach((el,index) => {
                let num = this.getTranslateX(el);
                if (num < 0) {
                    nextNum = num;
                    if (index > 0 && Math.abs(nextNum) < this.minMoveNum) {
                        nextNum = nextNum - this.sliderItems[index - 1].offsetWidth;
                    }
                }
            });
            if (!nextNum) {
                return;
            }
            let firstNum = this.getTranslateX(firstSliderItem);
            if (!firstNum) {
                firstNum = 0;
            }
            firstSliderItem.style.transform = "translateX(" + (firstNum - nextNum) + "px)";
            this.setTranslateX();
            this.judgeCanClick();
        },
        goNext() {
            if (!this.isSetTransition) {
                this.setTransition();
            }
            let firstSliderItem = this.sliderItems[0];
            let nextNum;
            this.sliderItems.forEach((el, index ) => {
                let num = this.getTranslateX(el);
                if (num + el.offsetWidth >= this.sliderWrap.offsetWidth) {
                    if (nextNum == undefined) {
                        nextNum = num + el.offsetWidth - this.sliderWrap.offsetWidth;
                        if (nextNum == 0) {
                            nextNum = el.offsetWidth;
                        }
                        if (index == this.sliderItems.length - 1 && nextNum == el.offsetWidth) {
                            nextNum = 0;
                        }
                        if (nextNum < this.minMoveNum && index < this.sliderItems.length - 1) {
                            nextNum = nextNum + this.sliderItems[index + 1].offsetWidth;
                        }
                    }
                }
            });
            if (!nextNum) {
                return;
            }
            let firstnum = this.getTranslateX(firstSliderItem);
            if (!firstnum) {
                firstnum = 0;
            }
            let newNum = firstnum - nextNum;
            firstSliderItem.style.transform = `translateX(${newNum}px)`;
            this.setTranslateX();
            this.judgeCanClick();
        },
        setTransition() {
            this.sliderItems.forEach(el => {
                el.style.transition = 'transform .3s ease';
            });
        },
        clearTransition() {
            this.isSetTransition = false;
            this.sliderItems.forEach(el => {
                el.style.transition = "unset";
            });
        },
        judgeCanClick() {
            let lastSliderItem = this.sliderItems[this.sliderItems.length -1];
            let firstSliderItem = this.sliderItems[0];
            let lastNum = this.getTranslateX(lastSliderItem);
            let num = lastNum + lastSliderItem.offsetWidth - this.sliderWrap.offsetWidth;
            if (num > 0) {
                this.setIsClick("hasRight", true);
            } else {
                let firstnum = this.getTranslateX(firstSliderItem);
                if (Math.abs(num) + firstnum >= 0) {
                    firstSliderItem.style.transform = "translateX(" + 0 + "px)";
                } else {
                    firstSliderItem.style.transform = "translateX(" + (firstnum + Math.abs(num)) + "px)";
                }
                this.setTranslateX();
                this.setIsClick("hasRight", false);
            }
            let firstNum = this.getTranslateX(firstSliderItem);
            if (firstNum < 0) {
                this.setIsClick("hasLeft", true);
            } else {
                this.setIsClick("hasLeft", false);
            }
        },
        setTranslateX() {
            this.sliderItems.forEach((el, index) => {
                if (index - 1 >= 0) {
                    let translateNum = this.getTranslateX(this.sliderItems[index - 1]);
                    let num = this.sliderItems[index - 1].offsetWidth + translateNum;
                    el.style.transform = `translateX(${num}px)`;
                }
            });
        },
        getTranslateX(dom) {
            return Number(dom.style.transform.replace(/[^0-9\-,]/g,''));
        }
    }
};
</script>

<style lang="scss" scoped>
.slider {
    display: flex;
    .prev_wrap, .next_wrap {
        flex-shrink: 0;
        width: 24px;
        font-size: 20px;
        color: white;
        >div {
            max-height: 180px;
            height: 100%;
            background: #CCCCCC;
            position: relative;
            border-radius: 3px;
            &.is_click {
                background: #ECCA31;
            }
            cursor: pointer;
            i {
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                position: absolute;
                font-weight: bold;
            }
        }
    }
    .slider_wrap {
        flex: 1;
        background: white;
        position: relative;
        overflow: hidden;
        >.slider_item {
            position: absolute;
            bottom: 0;
            top:0;
            left: 0;
            &:hover {
                z-index: 2;
            }
        }
    }
}
</style>
