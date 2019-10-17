<template>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="130px">
        <el-form-item label="房间名"
                      prop="title">
            <el-input v-model="form.title"
                      placeholder="房间名" />
        </el-form-item>
    </el-form>
</template>

<script>

import { require } from '../../util/valid';

export default {
    name: 'CreateRoom',
    data () {
        return {
            form: {
                title: ''
            },
            rules: {
                title: [require()]
            }
        };
    },
    methods: {
        getValue () {
            return this.form;
        }
    }
};
</script>
