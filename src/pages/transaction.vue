<script setup lang="ts">

import { ref, defineComponent } from 'vue'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import moment from 'moment'
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import html2pdf from 'html2pdf.js';
</script>

<script lang="ts">
let selectedTransactions: any = ref({ name: "All transactions" });
let selectedClients: any = ref({ name: 'All clients' });
let transactions: any = [
    { name: 'All transactions' },
    { name: 'All debits' },
    { name: 'All credits' },
    { name: 'Hourly' },
    { name: 'Fixed-price' },
    { name: 'Bonus' },
    { name: 'Adjustments' }
];
let clients: any = [{
    name: 'All clients'
}];

let formatter: any = ref({
    date: 'MMM DD, YYYY',
    month: 'MMM'
});

let histories: any = [
    { "type": "Membership Fee", "date": "Jan 11, 2023", "description": "Fees for additional connects (40)", "client": "", "balance": "$6.00", "ref_id": "6561865465" },
    { "type": "Membership Fee", "date": "Jan 12, 2023", "description": "Fees for additional connects (10)", "client": "", "balance": "$20.00", "ref_id": "1986465498" },
    { "type": "Membership Fee", "date": "Jan 1, 2023", "description": "Fees for additional connects (80)", "client": "", "balance": "$60.00", "ref_id": "8976419598" },
    { "type": "Membership Fee", "date": "Jan 4, 2023", "description": "Fees for additional connects (30)", "client": "", "balance": "$10.00", "ref_id": "9448498415" }
];

let tempHistories: any = histories;

let transactionDetailInfo: any = {}


const balanceModal = ref(false);
const transactionDetailModal = ref(false);
const advancedFilter = ref(false);

const openBalanceModal = () => {
    balanceModal.value = true;
}

const openTransactionDetail = (data: any) => {
    transactionDetailInfo = data;
    transactionDetailModal.value = true;

}

const openAdvancedFilter = () => {
    advancedFilter.value = !advancedFilter.value;
}

let dt = ref();

const downloadCSV = () => {
    dt.value.exportCSV();
}


export default defineComponent({
    data() {
        return {
            dateValue: {
                startDate: 'Jan 01, 2023',
                endDate: moment(new Date()).format("MMM DD, YYYY")
            }
        }
    },
    watch: {
        dateValue(value, oldValue) {
            if (value.startDate === '') {
                tempHistories = histories;
            } else {
                let startDate = new Date(value.startDate)
                let endDate = new Date(value.endDate)
                tempHistories = [];
                histories.map((transaction: any) => {
                    let date = new Date(transaction.date);
                    if (date >= startDate && date <= endDate) {
                        tempHistories.push(transaction);
                    }
                });
            }
        }
    },
    methods: {
        downloadInvoice() {
            html2pdf(document.getElementById("invoice-template"), {
                margin: 1,
                filename: "Invoice.pdf",
            })
        }
    }
})
</script>

<template>
    <main class="transaction-page container mx-auto py-8">
        <div class="transaction-header px-6">
            <h2 class="mb-4 text-4xl">Transaction history</h2>
            <div class="text-2xl">Balance:
                <button label="$0.00" class="text-main-color text-xl font-medium hover:underline"
                    @click="openBalanceModal">$0.00</button>
                <Dialog header="Balance details" v-model:visible="balanceModal" :style="{ width: '500px' }"
                    :modal="true">
                    <div>
                        <div class="text-lg font-medium">Statement Period</div>
                        <span>Dec 17, 2023 - Jan 16, 2023</span>
                    </div>
                    <div class="py-3">
                        <div class="w-full flex">
                            <div class="w-1/2 text-lg font-medium">Beginning Balance</div>
                            <div class="w-1/2">$26.00</div>
                        </div>
                        <div class="w-full flex pt-3">
                            <div class="w-1/2">Total debits</div>
                            <div class="w-1/2">$25.50</div>
                        </div>
                        <div class="w-full flex pt-3">
                            <div class="w-1/2">Total Credits</div>
                            <div class="w-1/2">$0.00</div>
                        </div>
                        <div class="w-full flex pt-3">
                            <div class="w-1/2">Total Change</div>
                            <div class="w-1/2">($25.50)</div>
                        </div>
                        <div class="w-full flex pt-3">
                            <div class="w-1/2 text-lg font-medium">Ending Balance</div>
                            <div class="w-1/2">$0.50</div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
        <div class="transaction-content mt-5 p-6 border-solid border rounded-xl border-gray-300">
            <div class="transaction-filter mb-6">
                <h4 class="text-base font-medium mb-1">Statement Period</h4>
                <div class="filter-content flex justify-between">
                    <div class="filter-content-left flex w-2/5">
                        <vue-tailwind-datepicker class="w-80" :formatter="formatter" v-model="dateValue" />
                        <button class="inline-flex items-center ml-4" @click="openAdvancedFilter">
                            <div class="filter-icon w-4 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-name="Layer 1"
                                    fill="#108a00" viewBox="0 0 14 14" role="img">
                                    <path
                                        d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z">
                                    </path>
                                </svg>
                            </div>
                            <span class=" text-main-color text-sm font-medium hover:underline">Filters</span>
                        </button>
                    </div>
                    <div class="filter-content-right flex">
                        <button
                            class="text-main-color font-medium bg-white border-2 px-6 rounded-3xl border-main-color shadow-sm hover:bg-gray-200"
                            @click="downloadCSV">
                            Download CSV
                        </button>
                        <button
                            class="text-white font-medium bg-main-color px-6 ml-3 border border-transparent rounded-3xl shadow-sm hover:bg-green-500"
                            @click="downloadInvoice">
                            Download Invoices
                        </button>
                    </div>
                </div>
                <div class="advanced-filter my-4" v-if="advancedFilter">
                    <Dropdown class="border-red" v-model="selectedTransactions" :options="transactions"
                        option-label="name" :filter="true" placeholder="Select" :showClear="true">
                        <template #value="slotProps">
                            <div v-if="slotProps.value">
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div>
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                    <Dropdown class="ml-3" v-model="selectedClients" :options="clients" option-label="name"
                        :filter="true" placeholder="Select" :showClear="true">
                        <template #value="slotProps">
                            <div v-if="slotProps.value">
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div>
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                    <button
                        class="block text-main-color bg-white border-2 px-7 font-medium py-2 mt-4 rounded-3xl border-main-color shadow-sm hover:bg-gray-200">
                        Apply
                    </button>
                </div>
            </div>
            <DataTable :value="tempHistories" ref="dt" :paginator="histories.length > 5 ? true : false" :rows="5">
                <Column field="date" header="Date"></Column>
                <Column field="type" header="Type"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="client" header="Client"></Column>
                <Column field="balance" header="Amount/Balancer"></Column>
                <Column field="ref_id" header="Ref ID">
                    <template #body="slotProps">
                        <button class="inline-flex items-center" @click="openTransactionDetail(slotProps.data)">
                            <span class=" text-main-color text-sm font-medium hover:underline">{{
                                slotProps.data.ref_id
                            }}</span>
                        </button>
                    </template>
                </Column>
            </DataTable>
            <Dialog header="Transaction details" v-model:visible="transactionDetailModal" :style="{ width: '500px' }"
                :modal="true">
                <div class="py-3">
                    <div class="w-full flex">
                        <div class="w-1/3">Reference ID</div>
                        <div class="w-2/3">{{ transactionDetailInfo.ref_id }}</div>
                    </div>
                    <div class="w-full flex pt-3">
                        <div class="w-1/3">Date</div>
                        <div class="w-2/3">{{ transactionDetailInfo.date }}</div>
                    </div>
                    <div class="w-full flex pt-3">
                        <div class="w-1/3">Type</div>
                        <div class="w-2/3">{{ transactionDetailInfo.type }}</div>
                    </div>
                    <div class="w-full flex pt-3">
                        <div class="w-1/3">Description</div>
                        <div class="w-2/3">{{ transactionDetailInfo.description }}</div>
                    </div>
                    <div class="w-full flex pt-3">
                        <div class="w-1/3">Amount</div>
                        <div class="w-2/3">{{ transactionDetailInfo.balance }}</div>
                    </div>
                    <div class="w-full flex pt-3">
                        <div class="w-1/3">More Info</div>
                        <div class="w-2/3">
                            <button class="inline-flex items-center" @click="downloadInvoice">
                                <div class="w-4 mr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="#108a00"
                                        viewBox="0 0 14 14" role="img">
                                        <path
                                            d="M8.409 5.6H7.011V0H2.8c-.771 0-1.4.63-1.4 1.401V12.6c0 .77.629 1.4 1.4 1.4h8.4c.77 0 1.4-.631 1.4-1.4v-7H8.409zm-4.365 5.404H3.61v1.676H2.8v-4.2h1.418c.828 0 1.104.629 1.104 1.258-.001.873-.512 1.266-1.278 1.266zm2.995 1.676H5.763v-4.2h1.328c1.119 0 1.327.799 1.327 2.041 0 1.483-.304 2.159-1.379 2.159zM11.2 9.175H9.765v.987h1.352v.695H9.765v1.822h-.81V8.48H11.2v.695zm-7.252-.071c.406 0 .563.229.563.646 0 .43-.22.631-.539.631H3.61V9.104h.338zm2.968 0c.612 0 .692.487.692 1.44 0 1.141-.113 1.512-.676 1.512h-.359V9.104h.343zM8.409 0l4.19 4.189v.012h-4.19V0z">
                                        </path>
                                    </svg>
                                </div>
                                <span class="text-main-color text-sm font-medium hover:underline">View Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
        <div ref="document" class="">
            <div id="invoice-template" class="invoice-box p-5">
                <table cellpadding="0" cellspacing="0">
                    <tr class="top">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td class="title">
                                        <img src="../assets/logo.svg"
                                            style="width: 100%; max-width: 100px" />
                                    </td>

                                    <td>
                                        <span class="text-4xl bg-gray-200 px-20 py-3 font-bold tracking-wider">INVOICE</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr class="information">
                        <td colspan="2">
                            <table>
                                <tr>
                                    <td>
                                        Sparksuite, Inc.<br />
                                        12345 Sunny Road<br />
                                        Sunnyville, CA 12345
                                    </td>

                                    <td>
                                        Acme Corp.<br />
                                        John Doe<br />
                                        john@example.com
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>


                    <tr class="heading">
                        <td>DESCRIPTION / MEMO</td>

                        <td>AMOUNT</td>
                    </tr>

                    <tr class="item">
                        <td>{{ transactionDetailInfo.description }}</td>

                        <td>{{ transactionDetailInfo.balance }}</td>
                    </tr>

                    <tr class="item last">
                        <td>TOTAL AMOUNT:</td>

                        <td>{{ transactionDetailInfo.balance }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </main>
</template>
