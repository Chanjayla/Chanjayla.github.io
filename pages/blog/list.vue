<template>
    <div class="article-box">
        <!-- <div class="article-box__header">
            <div class="mask"></div>
            <h1 class="tit">Blog</h1>
        </div> -->
        <div class="article-box__left">
            <blog-list :dataList="articleData" v-if="articleData"></blog-list>
            <el-pagination
                class="article-box__pagination"
                layout="prev, pager, next"
                :total="total"
                @current-change="changePage"
            ></el-pagination>
        </div>
        <div class="article-box__right"> 
            <tag-cloud :dataList="tagData" v-if="tagData"></tag-cloud>
            <div class="article-box__right__tit">
                <i class="el-icon-star-on"></i>
                <span>Most View</span>
            </div>
            <side-list :dataList="hotData" v-if="hotData"></side-list>        
        </div>
    </div>
</template>
<script>
import { transScroll } from '~/utils'
import * as Tag from '~/api/tag'
import * as Article from '~/api/article'
export default {
    layout: 'blog',
    components: {
        TagCloud: () => import('~/components/TagCol/index.vue'),
        BlogList: () => import('~/components/List/BlogList.vue'),
        SideList: () => import('~/components/List/SideList.vue')
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            articleData: null,
            hotData: null,
            tagData: null,
        }
    },
    asyncData({ error }) {
        if (process.server) {
            return Promise.all([
                Article.getPage({
                    page: 1,
                    pageSize: 10,
                    tags: [],
                }),
                Article.getHot(),
                Tag.getAll(),
            ])
                .then((res) => {
                    return {
                        articleData: res[0].data.data,
                        total : res[0].data.total,
                        hotData: res[1].data.data,
                        tagData: res[2].data.data,
                    }
                })
                .catch((err) => {
                    return {
                        articleData: [],
                        total : 0,
                        hotData: [],
                        tagData: [],
                    }
                })
        } else {
            return {
                isServer: false,
            }
        }
    },
    mounted() {
        if (this.isServer === false) {
            return Promise.all([
                Article.getPage({
                    page: 1,
                    pageSize: 10,
                    tags: [],
                }),
                Article.getHot(),
                Tag.getAll(),
            ]).then((res) => {
                this.articleData = res[0].data.data
                this.total = res[0].data.total
                this.hotData = res[1].data.data
                this.tagData = res[2].data.data
                this.$nextTick(() => {
                    this.$store.dispatch('app/toggleLoading', 2)
                })
            })
        } else {
            this.$store.dispatch('app/toggleLoading', 2)
        }
    },
    methods: {
        changePage(currPage) {
            Article.getPage({
                page: currPage,
                pageSize: this.pageSize,
            }).then((res) => {
                this.articleData = res.data.data
                transScroll(560, 300)
            })
        },
    },
    transition: 'blog',
}
</script>
<style lang="scss" scoped>
.article-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding-top: 60px;
    transition: all 0.2s ease;
    @media screen and (max-width: $mobileWidth) {
        min-width: 0;
    }
    &__header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 500px;
        background-image: url(/blog_page_header.jpg);
        background-attachment: fixed;
        background-size: cover;
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
        }
        .tit {
            position: absolute;
            bottom: 50px;
            left: 20px;
            right: 0;
            margin: auto;
            font-size: 50px;
            user-select: none;
            color: #fff;
        }
    }
    &__tags {
        width: 300px;
        height: 300px;
        background: #000;
        @media screen and (max-width: $mobileWidth) {
            display: none;
        }
    }
    &__left {
        margin-bottom: 30px;
        @media screen and (max-width: $mobileWidth) {
            width: 100%;
        }
    }
    &__right {
        max-width: 500px;
        padding-bottom: 20px;
        margin-left: 20px;
        @media screen and (max-width: $minViewWidth) {
            display: none;
        }
        &__tit {
            box-sizing: border-box;
            width: 100%;
            line-height: 40px;
            margin: 40px auto 20px auto;
            border-bottom: 1px dashed rgb(230, 230, 230);
            font-size: 1.2em;
        }
    }
    &__pagination {
        text-align: center;
    }
}
</style>
